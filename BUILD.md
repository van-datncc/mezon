Docs Fix 401: Your Apple ID has been locked - Mezon

Error: HTTP status code: 401. Your Apple ID has been locked. Visit iForgot to reset your account (https://iforgot.apple.com), then generate a new app-specific password. Ensure that all authentication arguments are correct.

Step1: Access https://developer.apple.com/account/ to unlock
note: Once you change your password, all App-Specific Passwords will be deleted.

Step2: Create an App-Specific Passwords with your Apple ID
Access https://appleid.apple.com/
=> App-Specific Passwords => Create Password

Step3: Update secrets on Github
Access Repo on Github => change secret Apple App-Specific Password
note: ID = account login
