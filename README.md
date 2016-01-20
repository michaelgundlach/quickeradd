# Quicker Add
#### Fixes bugs in Google Calendar's Quick Add.

---

*Version 0.3*:

**Feature: Missing months are allowed.**

On Jan 20th, if you quick add "8pm 21st foo" or "8pm 19th foo":
 - Without Quicker Add, Google Calendar doesn't know what to do.
 - With Quicker Add, the event will be placed on Jan 21st (or Feb 19th).

**Feature: The day of the week is never in the past.**

On Thursday, if you quick add "8pm Tuesday foo" or "foo Tuesday":
 - Without Quicker Add, the event will be placed on the past Tuesday.
 - With Quicker Add, the event will be placed next Tuesday.

[Installer here.](https://chrome.google.com/webstore/detail/quicker-add/ljegjmgpeggcplnmgcbaeliclmfekeha)

---

###TODO:

- Interpret "17th foo" as "on the next 17th of the month, foo"
