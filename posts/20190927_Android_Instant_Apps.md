---
title: "Android Instant Apps"
tags: ["android", "instant"]
date: September 27, 2019
blurb: "Android Instant Apps are an interesting feature. Unfortunately the documentation is terrible. Here's how I got it working."
---

Android Instant Apps
====================

Android Instant Apps are an interesting feature. Unfortunately the documentation is terrible. Here's how I got it working.

- Set up Google Play Signing and App Bundles
- Enable Instant App in project
- Running locally
- Make Any Instant App Specific Changes
- Transfer data from Instant App to Installed App
- Upload aab for real testing
- Gotchas


Android App Bundles and Google Play Signing
-------------------------------------------

App bundles are now a prerequisite for having an Instant app. There is older documentation that shows how to create a separate apk specific to the Instant App, but this is outdated. You should be using an app bundle and potentially an Instant App Dynamic Feature Module.

Enable Instant App in Project
-----------------------------

If your app is below the 4MB threshold you this might be as simple as adding a line to the AndroidManifest:
```xml
<dist:module dist:instant="true" />
```

If your app is larger and/or you need to separate out some things, then you will need to set up dynamic feature modules, including 1 for the Instant App.  

### Permissions

Only a subset of permissions are allowed for instant apps. Make sure you don't try to do things that you won't be allowed to do.

Running Locally
---------------

Using Android Studio:

Add an app configuration for the instant app:
1. Add configuration
2. apk from bundle
3. checkmark instant

Note - The way that instant apps work on devices means that deploying this way is slightly different than how 

Instant App Specific Code
-------------------------
If you still have a single module application, then you will just need conditionals to check for whether or not the running app is Instant, and branch the logic.

```kotlin
if(InstantApps.isInstantApp(context) {
  showInstallButton()
}
```

Note: as a best practice you should no branch the ux for the Instant version of your application. The Instant experience should represent the same experience that the user will get if they were to install the full version of the app.

Transferring Data to Installed Version
--------------------------------------

Google's documentation for this is terrible. There are a few supported ways to transfer data from the instant app to the installed version of the app.
1. DIY

    You can store things on your own server that can be grabbed again when the user installs the full version. eg - If your user logged into the instant app, anything that you need can be stored under that user. When they install the full version, you should still have all of that data.
     
2. Android O+

    On Android O+ a bunch of things are saved automatically. \*\*? do you need to update ths sandbox version?**
 
3. Instant App Cookie

    Available on all api levels. Undocumented and limited amount of storage.
    Can wrap it with some convenience methods to make it simpler to use. Be sure to understand that there is a size limit.
        
4. Storage API

    You can get a ZipInputStream in an unspecified format with a bunch of bytes in it that is your data. Good luck.


Uploading for Testing and Release
---------------------------------

Upload the aab and release it to an Internal Test track. Go to the Instant Apps section of the play console. Release the same aab to the Instant Apps Internal Test track.

Go to https://play.google.com/store/apps/details?id=*COM.MYAPP.PACKAGE.NAME*&launch=true from a device that is part of the internal test track to see it in action

Promote them to alpha/beta/prod as desired.


Notes

If you did the app bundles properly, you are checking for missing splits. This crashes Samsung 7.0 devices on Instant Apps. you need to make sure you aren't on an instant app prior to checking.
```kotlin
// MyApplication.kt
override fun onCreate() {
  if(!InstantApps.isInstantApp(this) && MissingSplitsManagerFactory.create(this).disableAppIfMissingRequiredSplits()) {
    return
  }
  // [...]
```