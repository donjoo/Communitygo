from celery import shared_task
from Backend.celery import app 



from django.core.mail import send_mail



@shared_task
def sent_otp(body,mail,header="otp Authentication communitygo"):
        send_mail(
                header,
                body,
                "donjorois@gmail.com",
                [mail],
                fail_silently=False,
        )


        return f'Mail send'








