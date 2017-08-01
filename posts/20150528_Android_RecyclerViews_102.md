---
title: "Android RecyclerViews 102: Swipe-to-Dismiss"
tags: ["android", "listview", "recyclerview", "swipe-to-dismiss", "tutorial"]
date: May 28, 2015
blurb: "Google released an updated support library today! It includes an ItemTouchHelper class that makes implementing swipe-to-dismiss awesomely simple for us to implement on the RecyclerView! Want to know how? Let’s get started!"
---

Android RecyclerViews 102: Swipe-to-Dismiss
===========================================

Google released an updated support library today! It includes an ItemTouchHelper class that makes implementing swipe-to-dismiss awesomely simple for us to implement on the RecyclerView! Want to know how? Let’s get started!


This tutorial picks up where [Android RecyclerViews 101][1] left off. If you want to skip 101, [clone the repo][2] and check out the [“102_Start”][3] tag.

Updating the Dependencies
-------------------------
The RecyclerView dependency that we added to our build.gradle file in the previous tutorial is now outdated. It will continue to work just fine, but we need to update it to v22.2.0 in order to use the ItemTouchHelper class. Pretty simple! Just change the line to match:

```java
compile 'com.android.support:recyclerview-v7:22.2.+'
```
ReSync Gradle and we’re ready to go.

Creating and setting up the ItemTouchHelper
-------------------------------------------
We are going to do 3 things to initialize an ItemTouchHelper:

1. We will create a SimpleCallback.
2. We will instantiate it.
3. We will attach it to the RecyclerView.
### Creating a SimpleCallback

The constructor for the ItemTouchHelper takes in an ItemTouchHelper.Callback. We are going to create an instance of the abstract subclass ItemTouchCallback.SimpleCallback for this purpose. One thing we need to know about the SimpleCallback is that its constructor has 2 parameters. Here is the signature:

```java
public SimpleCallback(int dragDirs, int swipeDirs) {
```
The first parameter defines which directions we want to allow the items in the RecyclerView to be dragged. We will set this as 0 here because we aren’t learning about drag and drop right now. For this tutorial, we are more concerned with the second parameter: swipeDirs. This defines which directions we want to allow the items to be swiped in. This parameter is a flag, so we can choose multiple directions and ‘OR’ them together. I’m going to allow Left and Right. Let’s create our anonymous SimpleCallback and assign it to a local variable in the OnCreate method of our MainActivity.

```java
ItemTouchHelper.SimpleCallback simpleItemTouchCallback = new ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT) {
    @Override
    public boolean onMove(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder, RecyclerView.ViewHolder viewHolder1) {
        return false;
    }

    @Override
    public void onSwiped(RecyclerView.ViewHolder viewHolder, int swipeDir) {
    }
};
```
### Instantiate an ItemTouchHelper

Since we have our callback, let’s instantiate an ItemTouchHelper.

```java
ItemTouchHelper itemTouchHelper = new ItemTouchHelper(simpleItemTouchCallback);
```
### Attaching an ItemTouchHelper

Finally, let’s attach it to the RecyclerView.
```java
itemTouchHelper.attachToRecyclerView(recyclerView);
```
**Important:** Some of you might have noticed that ItemTouchHelper is a subclass of RecyclerView.ItemDecoration. Typically, ItemDecorations are added to a RecyclerView through the recyclerView.addItemDecoration method. DON’T DO IT! The itemTouchHelper.attachToRecyclerView method does call recyclerView.addItemDecoration internally, but it also does a few other things that it needs to do in order to work properly.

Guess what? You have a working swipe animation in your list already! We’re not quite done yet, but run the app and try it out!

Now for the final steps:

Dismissing an Item When Swiped
------------------------------
In the 101 tutorial we created the adjectives list in a manner that doesn’t support removing items. Let’s wrap it in an ArrayList before we continue.

```java
private static final List<String> adjectives = new ArrayList<>(Arrays.asList(new String[]{
    "Awesome", "Peculiar", "Green", "Sad", "Gross", "Lovely", "Insane",
    "Compostable", "Blue", "Wooden", "Grotesque", "Beautiful"}));
```
Now we are going to implement the onSwiped method of the simpleCallback we created earlier. Specifically, we are going to

1. Get the position of the swiped item.
2. Remove the swiped item from our adjectives list.
3. Tell the adapter that we removed the item
And that’s all!

```java
@Override
public void onSwiped(RecyclerView.ViewHolder viewHolder, int swipeDir) {
    int position = viewHolder.getAdapterPosition();
    adjectives.remove(position);
    recyclerView.getAdapter().notifyItemRemoved(position);
}
```
Run the app and you now have swipe-to-dismiss on your RecyclerView!

[1]: http://jmcdale.com
[2]: http://jmcdale.com
[3]: http://jmcdale.com