---
title: Android RecyclerViews 101
tags: ["android", "listview", "recyclerview", "tutorial"]
date: December 05, 2014
blurb: "RecyclerViews for Android are the natural evolution of the ListView. They are cleaner, easier to use, and always enforce view recycling. Use them whenever you want to display data with a set of common views that can be reused for efficiency and to replace ListViews and GridView."
---

Android RecyclerViews 101
=========================

RecyclerViews for Android are the natural evolution of the ListView. They are cleaner, easier to use, and always enforce view recycling. Use them whenever you want to display data with a set of common views that can be reused for efficiency and to replace ListViews and GridView.

This tutorial will teach you how to use a RecyclerView to display a list of Strings.


Setup for this tutorial included the creation of a new project using the [Blank Activity] template in Android Studio. The resulting project includes: MainActivity.class.

Adding the Dependencies
-----------------------

The RecyclerView class must be manually included in your projects in order to use it. Why? I’m not sure, but maybe they just like us to have extra steps to do. Let’s add it.

Go into your build.gradle file—the one for your app, not the project. (The correct one for your app will say “android” somewhere in it.) Add this line:

```java
compile 'com.android.support:recyclerview-v7:21.0.+'
```
on a new line inside the dependencies section. ReSync gradle… and Boom! We can use it!

Adding the View
---------------

Add a RecyclerView for us to use in your xml layout file.

```xml
<android.support.v7.widget.RecyclerView
        android:id="@+id/recyclerView"
        android:scrollbars="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
```
Also, find it and pop it into a variable in the class you want to use it from.

```java
import android.support.v7.widget.RecyclerView;

public class MainActivity extends Activity {

    private RecyclerView recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        recyclerView = (RecyclerView) findViewById(R.id.recyclerView);
    // ...
```
Yay! We have something to work with now!

A RecyclerView requires 2 things before it will start working:

1. We must give it a LayoutManager.
2. We must give it an Adapter.

A LayoutManager is the class that defines how the views inside our RecyclerView get organized on the screen. There are some built-in LayoutManagers that we can instantiate and use:

* LinearLayoutManager – Layout Views linearly, vertically or horizontally.
* GridLayoutManager – Layout Views in a grid pattern.

### Adding the LayoutManager

Using one of these provided LayoutManagers allows us to easily replace ListViews and GridViews :). For this tutorial, we will use a LinearLayoutManager setup to display items vertically—like a ListView.

```java
recyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
```
Now that we know how to lay things out, we must start on the bulk of the work: creating our Adapter.

### Adding the Adapter

Before we start: let’s make sure we have a list of Strings that we’ll be displaying. I am adding a list to my MainActivity for this purpose. Any way you want to obtain a list of Strings is fine.

```java
private static final List adjectives = Arrays.asList(new String[]{
            "Awesome", "Peculiar", "Green", "Sad", "Gross", "Lovely", "Insane",
            "Compostable", "Blue", "Wooden", "Grotesque", "Beautiful"});
```

Next, let’s make a simple layout that includes a TextView for displaying each item in our list, and an ImageView that displays the launcher icon. (The ImageView is just to show that we can have multiple subviews for each item.)

Create an `li_adjective.xml` layout.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              xmlns:tools="http://schemas.android.com/tools"
              android:orientation="horizontal"
              android:layout_width="match_parent"
              android:layout_height="wrap_content">

    <ImageView
        android:id="@+id/ivImage"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:src="@drawable/ic_launcher"/>

    <TextView
        android:id="@+id/tvText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_vertical"
        tools:text="EXAMPLE ITEM"/>

</LinearLayout>
```

Adapter Time! Create a class:

```java
public class RecyclerViewStringListAdapter extends RecyclerView.Adapter {
```
The Adapter class requires us to have an extension of RecyclerView.ViewHolder for recycling purposes. This ViewHolder is meant to be an accessor for all the subviews of each item. In our example, we will only require a TextView, but more complex scenarios could include any number of TextViews, ImageViews, or other Views.

So inside of RecyclerViewStringListAdapter, let’s create an inner class that extends RecyclerView.ViewHolder and grabs a reference to our TextView that we will use to display our String and the ImageView (in case we want to change the image for each item).

```java
protected class ViewHolder extends RecyclerView.ViewHolder {
    ImageView ivImage;
    TextView tvText;

    public ViewHolder(View itemView) {
        super(itemView);
        ivImage = (ImageView) itemView.findViewById(R.id.ivImage);
        tvText = (TextView) itemView.findViewById(R.id.tvText);
    }
}
```

4 more things!
In this adapter we are required to Override onCreateViewHolder, onBindViewHolder, and getItemCount. We should also add a constructor that we can use to pass in the data we want the adapter to use.

First, add a member variable and a constructor that takes in a list of Strings and keeps the reference:

```java
private List strings;

public RecyclerViewStringListAdapter(List strings) {
    this.strings = strings;
}
```

Next, let’s override getItemCount. It is very simple with a list backing our data.

```java
@Override
public int getItemCount() {
    return strings.size();
}
```

Next comes onCreateViewHolder. This method is for us to inflate an item view and populate a ViewHolder object to reference it.

```java
@Override
public ViewHolder onCreateViewHolder(ViewGroup parent, int i) {
    View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.li_adjective, parent, false);
    ViewHolder viewHolder = new ViewHolder(itemView);
    return viewHolder;
}
```
Finally, we have the onBindViewHolder. This method is for populating all views in the provided ViewHolder that will be placed at the provided position. For us it’s simple: set the text on the TextView. We could also change the image here if we really wanted to.

```java
@Override
public void onBindViewHolder(ViewHolder viewHolder, int position) {
    viewHolder.tvText.setText(strings.get(position));
}
```
Guess what? We’re almost done! All that’s left is to create an instance of our RecyclerViewStringListAdapter class and set it to the RecyclerView 🙂

```java
recyclerView.setAdapter(new RecyclerViewStringListAdapter(adjectives));
```
Tada!