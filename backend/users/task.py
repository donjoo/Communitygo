from celery import shared_task
from backend.celery import app



from django.core.mail import send_mail



@shared_task
def sent_otp(body,mail,header="otp Authentication communitygo"):
        print('hey send mail')
        send_mail(
                header,
                body,
                "donjorois@gmail.com",
                [mail],
                fail_silently=False,
        )


        return f'Mail send'








