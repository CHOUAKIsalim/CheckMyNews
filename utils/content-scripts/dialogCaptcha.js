


/**Function to show Dialog to user */
var whitebgHtml = '    <div id="white-background" style="display:none;width:100%;height:100%; position:fixed; top:0px; left:0px;background-color:#fefefe;opacity:0.7;z-index:9999">'
whitebgHtml += '    </div>';

var dialogHtml = "";
dialogHtml +='    <div id="dlgbox" style="display: none; position: fixed;width: 480px;z-index: 9999;border-radius: 5px;background-color: #7c7d7e;">'
dialogHtml += '        <div id="dlg-header" style="background-color: #4267b2; color: white; font-size:1.1em ;font-weight:bold; padding: 10px;margin: 10px 10px 0px 10px;">AdAnalyst: Action required</div>'
dialogHtml += '        <div id="dlg-body" style="background-color: white;color: black;padding:10px;margin: 0px 10px 0px 10px;"><p style="text-align:justify">Hello, <b>we need your help</b> to click on the <i>``Why am I seeing this ad?’’</i> button on any ad you find, and solve the <b>CAPTCHA</b>:</p><div><img id="dlgCaptchaImg" style="width:440px; border:1px solid #7C8589" /></div><p style="text-align:justify">Recently, <b>Facebook</b> introduced a <b>CAPTCHA</b> mechanism in their <i>``Why am I seeing this ad?”</i> buttons, which make us unable to collect explanations about the ads you receive, and consequently unable to show you our analysis about how you are being targeted.</p><p>Thanks a lot for your time!</p><p>We hope that our app lives up to your standards, and helps you make more sense of the ads you receive.</p><p>Regards,<br/>the <a target="_blank" style="decoration:None" href="https://adanalyst.mpi-sws.org/">AdAnalyst</a> team</p></div >'
dialogHtml +='        <div id="dlg-footer" style="background-color: #f2f2f2;padding: 10px;margin: 0px 10px 10px 10px;">'
dialogHtml += '<input type="checkbox" id="chk_notShow" style="vertical-align:middle"/><span style="color:#545D61">Don\'t notify me again.</span>'
dialogHtml += '            <button style="background-color: #4267b2;color: white;padding: 5px;border: 0px; margin-left:60px;font-weight:bold">Close</button>'
dialogHtml +='        </div>'
dialogHtml +='    </div>'

function createDialog(dialogHtml) {
    var elm1 = $(whitebgHtml);
    var elm2 = $(dialogHtml);
    $('body').append(elm1,elm2);

    var whitebg = document.getElementById("white-background");
    var dlg = document.getElementById("dlgbox");

    var imgURL = chrome.extension.getURL('solving_captcha.gif');
    var img = document.getElementById('dlgCaptchaImg')
    img.src = imgURL;
    //img.style.width = "410px";

    whitebg.style.display = "block";
    dlg.style.display = "block";

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    dlg.style.left = (winWidth / 2) - 530 / 2 + "px";
    dlg.style.top = "50px";

    var dlgFooter = document.querySelector('#dlg-footer')
    dlgFooter.querySelector("button").addEventListener("click", function () {
        var whitebg = document.getElementById("white-background");
        var dlg = document.getElementById("dlgbox");
        var chk = document.getElementById("chk_notShow");
        whitebg.style.display = "none";
        dlg.style.display = "none";

        //Send message to background to confirm closing popup
        msg = {}
        msg[MSG_TYPE] = 'hide_popup'
        msg['chk_option'] = (chk.checked) ? "1" : "0"
        chrome.runtime.sendMessage(msg);

    });

    var whiteBackground = document.querySelector('#white-background');
    whiteBackground.addEventListener("click", function(){
        var whitebg = document.getElementById("white-background");
        var dlg = document.getElementById("dlgbox");
        var chk = document.getElementById("chk_notShow");
        whitebg.style.display = "none";
        dlg.style.display = "none";

        //Send message to background to confirm closing popup
        msg = {}
        msg[MSG_TYPE] = 'hide_popup'
        msg['chk_option'] = (chk.checked) ? "1" : "0"
        chrome.runtime.sendMessage(msg);
    });
}
