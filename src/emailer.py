from email.message import EmailMessage
from securepassing import safe_logger
import ssl
import smtplib
import sys
import datetime

import scriptexecution


def passwordResetLink(To, link):
    complexForgotPasswordEmail(To, link)
    

def html_reader(htmlFile, covertDict):
    content = readfile(htmlFile)
    for key in covertDict.keys():
        content = content.replace(key, covertDict[key])
    return content


def complexForgotPasswordEmail(receiver, link, subject='MedSavvy - Forgot Password?'):
    em = emailBuilder(
        'MedSavvy.DONOTREPLY@gmail.com', 
        receiver, 
        subject,
        ''
    )
    replacer = {
        '((RESET_PASSWORD_LINK))': link,
        '((FACEBOOK_LINK))': 'https://www.facebook.com/profile.php?id=100091464866746'
    }
    em.add_alternative(
        html_reader('ResetEmail.html', replacer),
        subtype='html'
    )
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(
            'MedSavvy.DONOTREPLY@gmail.com', 
            safe_logger()
        )
        smtp.send_message(em)


def confirmationEmail(receiver, link, username, subject='MedSavvy - Confirm Your Email'):
    em = emailBuilder(
        'MedSavvy.DONOTREPLY@gmail.com', 
        receiver, 
        subject,
        ''
    )
    em.add_alternative(
        readfile('ConfirmationEmail.html').replace('((LINK_TO_EMAIL_CONFIRMATION_PAGE))', link).replace("((USERNAME))", username),
        subtype='html'
    )
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(
            'MedSavvy.DONOTREPLY@gmail.com', 
            safe_logger()
        )
        smtp.send_message(em)
        

def complexEmail(name, receiver, subject, backup_body, link):
    # password = os.environ.get('email_password')
    em = emailBuilder(
        'MedSavvy.DONOTREPLY@gmail.com', 
        receiver, 
        subject,
        backup_body
    )
    em.add_alternative(
        readfile('body.html').replace('((USER_NAME))', name).replace('((LINK_TO_RESET_PAGE))', link),
        subtype='html'
    )
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(
            'MedSavvy.DONOTREPLY@gmail.com', 
            safe_logger()
        )
        smtp.send_message(em)
        

def readfile(filename, onelinemax=False):
    with open(filename, 'r') as f:
        if onelinemax: return f.readline()
        return f.read()


def emailBuilder(From, To, Subject, Body):
    em = EmailMessage()
    em['From'] = From
    em['To'] = To
    em['Subject'] = Subject
    em.set_content(Body)
    return em
    

def execEmail(To, Subject, Body):
    em = emailBuilder(
        'MedSavvy.DONOTREPLY@gmail.com', 
        To, 
        Subject,
        Body
    )

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login('MedSavvy.DONOTREPLY@gmail.com', safe_logger())
        smtp.sendmail('MedSavvy.DONOTREPLY@gmail.com', To, em.as_string())


def forgotPasswordEmail(To, name, nonse, subject='MedSavvy - Reset Password', body=None):
    if not body:
        body = f"""
Hi {name},
Seems like you forgot your password for MedSavvy. If this is true, enter {nonse} to reset your password. If you did not request to reset your password please reach out to our customer support line to have your data secured.

Best,
-MedSavvy Support Team
"""
    execEmail(To, subject, body)


def twoStepEmail(To, name, nonse, subject='MedSavvy - 2-Step Verification', body=None):
    if not body:
        body = f"""
Hi {name},
Here is your 2-Step Verification number: {nonse}. This number expires in 15 minutes. If you did not login just now please reach out to our customer support line to have your data secured.

Best,
-MedSavvy Support Team
"""
    execEmail(To, subject, body)


def errorLog(issue):
    with open('error.log', 'a') as el:
        el.write(f'{datetime.datetime.now()}  {issue}\n\n')


def sendEmail(To, fSub, fBody):
    execEmail(To, readfile(fSub, onelinemax=True), readfile(fBody))


def passwordResetEmail(To, name, link, subject='MedSavvy - Reset Password', body=None):
    if not body:
        body = f"""
Hi {name},
Looks like you requested to reset your password for MedSavvy. If this is the case: click here: {link}. If you did not request to reset your password you may safly ignore this email.

Best,
-MedSavvy Support Team
"""
    execEmail(To, subject, body)
    

def fpe(typer):
    _to, _name, _nonse = typer['__primary_input__']
    _subject='MedSavvy - Reset Password'
    _body=None
    if 'subject' in typer.keys():
        _subject = typer['subject']
    if 'body' in typer.keys():
        _body = typer['body']
    forgotPasswordEmail(_to, _name, _nonse, subject=_subject, body=_body)

def pre(typer): # passwordResetEmail
    _to, _name, _link = typer['__primary_input__']
    _subject='MedSavvy - Reset Password'
    _body=None
    if 'subject' in typer.keys():
        _subject = typer['subject']
    if 'body' in typer.keys():
        _body = typer['body']
    passwordResetEmail(_to, _name, _link, subject=_subject, body=_body)

def tse(typer): # twoStepEmail
    _to, _name, _nonse = typer['__primary_input__']
    _subject='MedSavvy - 2-Step Verification'
    _body=None
    if 'subject' in typer.keys():
        _subject = typer['subject']
    if 'body' in typer.keys():
        _body = typer['body']
    twoStepEmail(_to, _name, _nonse, subject=_subject, body=_body)

def sce(typer): # execEmail
    _to = typer['__primary_input__']
    _subject='default'
    _body="none"
    if 'subject' in typer.keys():
        _subject = typer['subject']
    if 'body' in typer.keys():
        _body = typer['body']
    execEmail(_to, _subject, _body)

def pre2(typer): # complexForgotPasswordEmail
    _to, _link = typer['__primary_input__']
    _subject = 'MedSavvy - Forgot Password?'
    if 'subject' in typer.keys():
        _subject = typer['subject']
    complexForgotPasswordEmail(_to, _link, subject=_subject)

def ce(typer): #confirmationEmail(receiver, link, username, subject='MedSavvy - Confirm Your Email')
    _to, _link, _username = typer['__primary_input__']
    _subject='MedSavvy - Confirm Your Email'
    if 'subject' in typer.keys():
        _subject = typer['subject']
    confirmationEmail(_to, _link, _username, subject=_subject)
    

functions_dict = {
    #'forgotPasswordEmail': (fpe, 3),
    #'passwordResetEmail': (pre, 3),
    'twoStepEmail': (tse, 3),
    'sendCustomEmail': (sce, 1),
    'passwordResetEmail': (pre2, 2),
    'confirmationEmail': (ce, 3)
}


def help_message():
    message="""
twoStepEmail <-to->(type:email) <-name->(type:string) <-nonse->(type:number)
    + subject
    + body
sendCustomEmail <-to->(type:email) 
    + subject
    + body
passwordResetEmail <-to->(type:email) <-link->(type:link)
    + subject
confirmationEmail <-to->(type:email) <-link->(type:link) <-username->(type:string)
    + subject
"""
    print(message)


def main(argv, argc):
    e = scriptexecution.executor(argc, argv, functions_dict)
    e.execute()


if __name__ == '__main__':
    if len(sys.argv) == 2 and sys.argv[1] == 'help':
        help_message()
    else:
        main(sys.argv, len(sys.argv))

