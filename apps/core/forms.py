import re
from django import forms
from django.utils.translation import gettext_lazy as _
from apps.core.models import Inquiry

class InquiryForm(forms.ModelForm):
    # Honeypot field for spam bots (hidden via CSS from legitimate human visitors)
    website_url = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'autocomplete': 'off',
            'tabindex': '-1',
            'class': 'hp-field',
            'aria-hidden': 'true',
        }),
        label=_('اتركه فارغاً')
    )

    class Meta:
        model = Inquiry
        fields = ['name', 'phone', 'email', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'الاسم بالكامل أو اسم الشركة المستوردة',
                'required': 'required',
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'رقم الهاتف أو الواتساب مع كود الدولة (مثال: 01012345678+)',
                'required': 'required',
                'dir': 'ltr',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-input',
                'placeholder': 'البريد الإلكتروني التجاري (اختياري)',
                'dir': 'ltr',
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-textarea',
                'rows': 5,
                'placeholder': 'اذكر تفاصيل المنتجات المطلوبة، الكميات التقريبية، ميناء الوصول المطلوب، وشروط الشحن المفضلة (FOB/CIF)...',
                'required': 'required',
            }),
        }
        labels = {
            'name': _('اسم العميل / اسم المؤسسة'),
            'phone': _('رقم الهاتف / الواتساب الدولي'),
            'email': _('البريد الإلكتروني المعتمد (اختياري)'),
            'message': _('تفاصيل الاستفسار أو طلب التوريد'),
        }

    def clean_website_url(self):
        val = self.cleaned_data.get('website_url', '').strip()
        if val:
            raise forms.ValidationError(_('تم رفض الطلب كرسالة بريد عشوائي (Spam Detected).'))
        return val

    def clean_name(self):
        name = self.cleaned_data.get('name', '').strip()
        if len(name) < 2:
            raise forms.ValidationError(_('يرجى إدخال اسم صحيح لا يقل عن حرفين.'))
        return name

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '').strip()
        # Clean phone: allow +, numbers, spaces, dashes
        cleaned_phone = re.sub(r'[^\d+]', '', phone)
        if len(cleaned_phone) < 7:
            raise forms.ValidationError(_('يرجى إدخال رقم هاتف صحيح لا يقل عن 7 أرقام.'))
        return phone

    def clean_message(self):
        msg = self.cleaned_data.get('message', '').strip()
        if len(msg) < 10:
            raise forms.ValidationError(_('يرجى توضيح تفاصيل الطلب بحيث لا تقل الرسالة عن 10 أحرف.'))
        if len(msg) > 4000:
            raise forms.ValidationError(_('الرسالة طويلة جداً، يرجى اختصارها في حدود 4000 حرف.'))
        return msg
