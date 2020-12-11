function popitup(url) {
    newwindow=window.open(url,'name','height=300,width=650,top=75,left=860');
    if (window.focus) {
        newwindow.focus();
    }
    return false;
}