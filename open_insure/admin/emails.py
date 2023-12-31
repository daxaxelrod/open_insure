from django.core.mail import send_mail
from django.conf import settings
from pods.models import User


def send_notif_email_to_admins(title, description):
    """
    Sends an email to all admins
    title: subject of the email
    description: body of the email, make as long as you want
                 description can be html
    """
    admins = User.objects.filter(is_superuser=True).values_list("email", flat=True)
    if settings.DEBUG:
        title = f"[DEBUG] {title}"
    send_mail(
        title,
        description,
        settings.DEFAULT_FROM_EMAIL,
        admins,
        fail_silently=True,
        html_message=description,
    )
