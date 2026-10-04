import csv
from datetime import datetime, time, timedelta
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Q, Count

from apps.audit.models import ActivityLog

User = get_user_model()

def superuser_required(view_func):
    """
    Decorator that requires the user to be an authenticated superuser (business owner).
    Redirects unauthenticated users to admin login, and raises PermissionDenied (403)
    for logged-in non-superusers.
    """
    def _wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(f'/admin/login/?next={request.path}')
        if not request.user.is_superuser:
            raise PermissionDenied("عفواً، لوحة الرقابة والتدقيق الأمني مخصصة لمالك الشركة ومدير المنظومة فقط.")
        return view_func(request, *args, **kwargs)
    return _wrapped


@superuser_required
def activity_dashboard_view(request):
    logs = ActivityLog.objects.select_related('user').all()

    # Filters
    selected_employee = request.GET.get('employee', '').strip()
    selected_action = request.GET.get('action', '').strip()
    date_from_raw = request.GET.get('date_from', '').strip()
    date_to_raw = request.GET.get('date_to', '').strip()
    query = request.GET.get('q', '').strip()

    if selected_employee:
        if selected_employee.isdigit():
            logs = logs.filter(user_id=int(selected_employee))
        else:
            logs = logs.filter(username_snapshot=selected_employee)

    if selected_action:
        logs = logs.filter(action=selected_action)

    # Date filters
    now = timezone.now()
    cairo_today = timezone.localdate(now)

    if date_from_raw:
        try:
            d_from = datetime.strptime(date_from_raw, '%Y-%m-%d').date()
            dt_from = timezone.make_aware(datetime.combine(d_from, time.min))
            logs = logs.filter(timestamp__gte=dt_from)
        except ValueError:
            pass

    if date_to_raw:
        try:
            d_to = datetime.strptime(date_to_raw, '%Y-%m-%d').date()
            dt_to = timezone.make_aware(datetime.combine(d_to, time.max))
            logs = logs.filter(timestamp__lte=dt_to)
        except ValueError:
            pass

    if query:
        logs = logs.filter(
            Q(username_snapshot__icontains=query) |
            Q(target_description__icontains=query) |
            Q(ip_address__icontains=query) |
            Q(user_agent__icontains=query)
        )

    # CSV Export
    if request.GET.get('export') == 'csv':
        response = HttpResponse(content_type='text/csv; charset=utf-8-sig')
        filename = f"activity_log_{cairo_today.strftime('%Y%m%d')}.csv"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        # UTF-8 BOM so Excel opens Arabic correctly
        response.write('\ufeff')

        writer = csv.writer(response)
        writer.writerow([
            'التوقيت',
            'الموظف',
            'اسم المستخدم',
            'نوع الإجراء',
            'بيان العملية',
            'تفاصيل التعديل (قبل وبعد)',
            'عنوان IP',
            'بيانات المتصفح والنظام'
        ])

        for log in logs[:5000]:  # Cap export to 5000 rows
            writer.writerow([
                timezone.localtime(log.timestamp).strftime('%Y-%m-%d %H:%M:%S'),
                log.user.get_full_name() if log.user else 'غير مسجل',
                log.username_snapshot,
                log.get_action_display(),
                log.target_description,
                str(log.changed_fields) if log.changed_fields else '',
                log.ip_address or '',
                log.user_agent or ''
            ])
        return response

    # Per-employee summary
    # Calculate for all active staff users or users who have actions
    users = User.objects.filter(is_active=True).order_by('username')
    today_start = timezone.make_aware(datetime.combine(cairo_today, time.min))
    week_start = today_start - timedelta(days=7)

    employee_summaries = []
    for emp in users:
        # Actions count today
        today_count = ActivityLog.objects.filter(
            user=emp,
            timestamp__gte=today_start
        ).count()

        # Actions count this week
        week_count = ActivityLog.objects.filter(
            user=emp,
            timestamp__gte=week_start
        ).count()

        # Latest login
        last_login_log = ActivityLog.objects.filter(
            user=emp,
            action='login'
        ).order_by('-timestamp').first()

        last_login_time = None
        if last_login_log:
            last_login_time = timezone.localtime(last_login_log.timestamp)
        elif emp.last_login:
            last_login_time = timezone.localtime(emp.last_login)

        employee_summaries.append({
            'user': emp,
            'full_name': emp.get_full_name() or emp.username,
            'role': 'مالك المنظومة (مدير عام)' if emp.is_superuser else ('موظف إداري (Staff)' if emp.is_staff else 'مستخدم'),
            'last_login': last_login_time,
            'today_actions': today_count,
            'week_actions': week_count,
        })

    # Pagination
    paginator = Paginator(logs, 30)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Distinct actions for filter dropdown
    action_choices = ActivityLog.ACTION_CHOICES

    # All employees for dropdown
    all_employees = User.objects.filter(is_staff=True).order_by('username')

    context = {
        'page_obj': page_obj,
        'employee_summaries': employee_summaries,
        'action_choices': action_choices,
        'all_employees': all_employees,
        'selected_employee': selected_employee,
        'selected_action': selected_action,
        'date_from': date_from_raw,
        'date_to': date_to_raw,
        'query': query,
        'total_filtered': logs.count(),
        'total_all_logs': ActivityLog.objects.count(),
        'cairo_now': timezone.localtime(now),
    }

    return render(request, 'audit/dashboard.html', context)
