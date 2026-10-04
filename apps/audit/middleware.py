import contextvars
import ipaddress

from django.conf import settings

# Context variables to track acting user and client details across the request lifecycle
_current_user = contextvars.ContextVar('current_user', default=None)
_current_ip = contextvars.ContextVar('current_ip', default=None)
_current_user_agent = contextvars.ContextVar('current_user_agent', default='')

def get_current_user():
    return _current_user.get()

def get_current_ip():
    return _current_ip.get()

def get_current_user_agent():
    return _current_user_agent.get()

def set_audit_context(user=None, ip=None, user_agent=''):
    _current_user.set(user)
    _current_ip.set(ip)
    _current_user_agent.set(user_agent)

def clear_audit_context():
    _current_user.set(None)
    _current_ip.set(None)
    _current_user_agent.set('')

def extract_client_ip(request):
    """
    Resolve the real client IP.

    X-Forwarded-For is attacker-controlled unless it was written by our own
    proxy, so it is only honoured when TRUSTED_PROXY_COUNT > 0, and then the
    entry added by the *last trusted proxy* is used (counted from the right)
    instead of the first one, which the client could have forged.
    """
    remote = request.META.get('REMOTE_ADDR') or None
    hops = getattr(settings, 'TRUSTED_PROXY_COUNT', 0)
    if hops > 0:
        forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
        chain = [part.strip() for part in forwarded.split(',') if part.strip()]
        if len(chain) >= hops:
            candidate = chain[-hops]
            try:
                return str(ipaddress.ip_address(candidate))
            except ValueError:
                pass
    return remote

class AuditUserMiddleware:
    """
    Middleware that captures the authenticated user, client IP, and user-agent
    into thread-safe contextvars for the duration of each HTTP request.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, 'user', None)
        if user and not user.is_authenticated:
            user = None

        ip = extract_client_ip(request)
        ua = request.META.get('HTTP_USER_AGENT', '')[:500]

        t_user = _current_user.set(user)
        t_ip = _current_ip.set(ip)
        t_ua = _current_user_agent.set(ua)

        try:
            response = self.get_response(request)
        finally:
            _current_user.reset(t_user)
            _current_ip.reset(t_ip)
            _current_user_agent.reset(t_ua)

        return response
