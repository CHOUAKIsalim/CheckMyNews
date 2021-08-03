console.log("Misinfo Injected successfully !! ")


var banner = `
    
<style>

.misinfo-banner-container{
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
}
.misinfo-banner{

}
.banner-text{
    padding: 1rem .8rem;
    background-color: white;
    font-size: 1.75rem;
    color: black;
    font-weight: 500;
    text-align:center;
}
.learn-more-btn{
    padding: 1rem .8rem;
    background-color:teal;
    color: white;
    font-size: 1.75rem;
    font-weight: 500;
    text-align:center;
    
}
.hide-btn{
    padding: 1rem .8rem;
    background-color:transparent;
    color: black;
    font-size: 1.75rem;
    font-weight: 500;
    text-align:center;
    
}
.buttons-container{
    margin-top: .725rem; 
    display: flex;
    justify-content:space-between;
}
</style>

<div class="misinfo-banner-container">
<div class="misinfo-banner">
    <div class="banner-text">
        False Information
    </div>
    <div class="buttons-container">
        <div class="learn-more-btn">Learn More</div>
        <div class="hide-btn">Hide Banner</div>
    </div>
    
</div>
</div>

`


document.addEventListener("postCollected",function (event){
    // if (event.source != window)
    // return;
    console.log("event triggered !!!!!!!!")
    console.log(event.detail.adData["html_ad_id"])

    postContainer = document.getElementById(event.detail.adData["html_ad_id"])

    postContainer.style.opacity = 0.3
    postContainer.style.position = "relative"
    postContainer.innerHTML += banner
    // $("#" + adData["html_ad_id"]).css("opacity","0.1")
    
})





