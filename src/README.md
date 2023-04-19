# emailer

<br>

### For help
`python3 emailer.py help`
    
### Sample run:
##### Send a 2-Step email to Jacob with the number 465892:
`python3 emailer.py twoStepEmail noah6red@gmail.com Jacob 465892`
##### Send a custom email to jacob@wpi.edu with the subject 'test email from MedSavvy':
`python3 emailer.py sendCustomEmail jacob@wpi.edu -subject='test email from MedSavvy'`
##### Send an HTML password reset email to user@wpi.edu with the link 'PR_link':
`python3 emailer.py passwordResetEmail user@wpi.edu PR_link`
##### Send an HTML password reset email to user@wpi.edu with the link 'PR_link' with the subject 'Password reset email':
`python3 emailer.py passwordResetEmail user@wpi.edu PR_link -subject='Password reset email'`
##### Send a confirmation email after a new user signs up. With email email@gmail.com, username: Jacob, and link to confirmation page as https://localhost:400:
`python3 emailer.py confirmationEmail email@gmail.com https://localhost:400 Jacob`
##### Send a confirmation email after a new user signs up. With email email@gmail.com, username: Jacob, and link to confirmation page as https://localhost:400 with the subject 'SAMPLE SUBJECT':
`python3 emailer.py confirmationEmail email@gmail.com https://localhost:400 Jacob -subject='SAMPLE SUBJECT'`
