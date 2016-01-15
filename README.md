# Quicker Add
#### Fixes bugs in Google Calendar's Quick Add.

---

*Version 0.2*:

**Feature: The day of the week is never in the past.**

On Thursday, if you quick add "Tuesday foo" or "foo Tuesday":
 - Without Quicker Add, the event will be placed on the past Tuesday.
 - With Quicker Add, the event will be placed next Tuesday.

---

###TODO:

- Interpret "17th foo" as "on the next 17th of the month, foo"
