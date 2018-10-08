//TODO typescript?

function openTab(evt, tabName) {
    let i, tabContent, tabLinks, tabNames;
    tabContent = document.querySelectorAll(".multi .tabcontent");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    tabLinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    tabLinks = document.querySelectorAll(".multi .tablinks." + tabName);
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className += " active";
    }

    tabNames = document.querySelectorAll(".multi ." + tabName);
    for (i = 0; i < tabNames.length; i++) {
        tabNames[i].style.display = "block";
    }
}