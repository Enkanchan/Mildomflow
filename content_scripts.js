
window.addEventListener("load", main, false); //ロード待ち
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
document.body.insertAdjacentHTML('afterbegin', '<div id="p5Canvas"></div>') //bodyに埋め込む
var CommentPopPosX;
var CommentPopPosY;
var CommentText = [];
var CommentTextPosX = [];
var CommentTextPosY = [];
for(let i=0;i<30;i++){
    CommentText[i] = 'null';
    CommentTextPosX[i]=0;
    CommentTextPosY[i]=0;
}

function setup(){
    console.log("p5 start");
    let canvas = createCanvas(400, 400);
    canvas.parent('p5Canvas');
}

function draw() {
    clear();
    fill(255);
    textSize(20);
    for(let i=0; i<30; i++){
        if(CommentText[i] !== 'null'){
            text(CommentText[i], CommentTextPosX[i], CommentTextPosY[i]+5);
            CommentTextPosX[i]=CommentTextPosX[i]-2;
            if(CommentTextPosX[i] <= (0 - textWidth(CommentText[i]))){
                CommentText[i] = 'null';
            }

        }
    } 
}

async function main(e) {
    await _sleep(2000); //読み込み前に発動してオブザーバが時々スカるので待つ
    const LIVE_OR_ARCHIVE = document.querySelector('.hhJHOj') ? 1 : 0; //1 = archive

    //p5canvas 寸法設定など
    if(document.querySelector('.player-content')){
        var clientRect = document.querySelector('.player-content').getBoundingClientRect(); //配信領域の寸法取得
    }
    else{
        var clientRect = document.querySelector('.wrapper').getBoundingClientRect();
    }
    p5Canvas.style.top=clientRect.top + 'px';
    p5Canvas.style.left=clientRect.left + 'px';
    resizeCanvas(clientRect.width, clientRect.height);

    //コメントノード(全体)
    const target = document.querySelectorAll(".message-list")[0]; //取得出来ないとヤバいので見つかるまで後でループにする(sleepを消して)
    
    //オブザーバインスタンス作成(message-listにnodeが追加されたら動かす)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if(document.querySelector('.player-content')){
                clientRect = document.querySelector('.player-content').getBoundingClientRect(); //配信領域の寸法取得
            }
            else{
                clientRect = document.querySelector('.wrapper').getBoundingClientRect();
            }
            CommentPopPosX = clientRect.width;
            CommentPopPosY = clientRect.height;
            p5Canvas.style.top=clientRect.top + 'px';
            p5Canvas.style.left=clientRect.left + 'px';
            resizeCanvas(clientRect.width, clientRect.height);
            let list = document.querySelector('.message-list');
            let inBlocks;
            if(document.querySelector('.jYCNsb')){ //jYCNsb:archive kjBKsf:live
                inBlocks = list.lastElementChild.querySelector('.jYCNsb');
            }
            else{
                inBlocks = list.lastElementChild.querySelector('.kjBKsf');
            }
            for(let i=0;i<30;i++){
                if(CommentText[i] == 'null'){
                    if(inBlocks){
                        CommentText[i] = inBlocks.textContent;
                        CommentTextPosX[i] = CommentPopPosX;
                        CommentTextPosY[i] = Math.round (Math.random()*clientRect.height);
                        console.log("実行" + i)//
                        console.log(CommentText[i]);
                        break;
                    }
                }
            }

            console.log(inBlocks);
        });
    });

    //オブザーバの設定
    const config = { //message-list以下paddingの変更を検知
        childList: true
    };

    //オブザーバ実行
    observer.observe(target, config);
    
}

