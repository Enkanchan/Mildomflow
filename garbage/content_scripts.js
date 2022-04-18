
window.addEventListener("load", main, false); //ロード待ち
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//コメントを捕まえる
async function main(e) {
    await _sleep(2000); //読み込み前に発動してオブザーバが時々スカるので待つ


    //コメントノード(全体)
    const target = document.querySelectorAll(".message-list")[0]; //取得出来ないとヤバいので見つかるまで後でループにする(sleepを消して)
    
    //オブザーバインスタンス作成(message-listにnodeが追加されたら動かす)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            let list = document.querySelector('.message-list');
            let inBlocks = list.lastElementChild.querySelector('.jYCNsb');
            console.log(inBlocks); //最後のNodeを取得(debug)
            createText(inBlocks.textContent,stage,container,div); //流す処理に受け渡す(Text,createjs描画オブジェクト,格納コンテナ,canvas)
        });
    });

    //オブザーバの設定
    const config = { //message-list以下paddingの変更を検知
        childList: true
    };

    //オブザーバ初期処理 
    console.clear(); //一旦消してから
    
    //canvas生成(コメント描画領域,範囲ズレ矯正は呼び出し関数内で行う)
    const div = document.createElement('canvas');
    const clientRect = document.querySelector('.player-content').getBoundingClientRect(); //配信領域の寸法取得
    div.style.position='absolute';
    div.style.top=clientRect.top + 'px';
    div.style.left=clientRect.left + 'px';
    div.style.height=clientRect.height + 'px';
    div.style.width=clientRect.width + 'px';
    div.style.pointerEvents='none';
    document.body.appendChild(div);
    //ここまで

    //createjs 初期設定
    const canvasObject = div;
    var stage = new createjs.Stage(canvasObject);
    const container = new createjs.Container();
    stage.addChild(container);
    //ここまで 更新処理は呼び出し関数内で行う

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        stage.update();
    }
    //オブザーバ実行
    observer.observe(target, config);
    
}

//文字列を生成して流す
async function createText(msg,stage,container,div) {
    console.log("呼び出し検知")//
    const clientRect = document.querySelector('.player-content').getBoundingClientRect(); //配信領域の寸法取得
    //canvasの大きさが食い違っていたら矯正する
    if(div.style.height != clientRect.height){
        div.style.width=clientRect.width + 'px';
        div.style.height=clientRect.height + 'px';
    }

    var animatetext = new createjs.Text(msg, "10px Arial", "#ffffff"); //生成テキスト
    let MaxPosX = Math.round(clientRect.width);
    container.addChild(animatetext);

    console.log("height:"+clientRect.height);
    console.log("width:"+clientRect.width);
    animatetext.textAligin = "left";
    animatetext.textBaseline = "top";
    animatetext.alpha = 1.0;
    animatetext.scale = 1;
    animatetext.x = Math.round(clientRect.width) -500;
    animatetext.y = 132//Math.round (Math.random()*clientRect.height / 4)
    //animatetext.snapToPixel = false;
    //animatetext.outline = 1;
    //animatetext.color = "white";
    console.log(msg.length*10);
    createjs.Tween.get(animatetext)
            .to({x:-100-msg.length*10},7000);
    
    //console.log(container.children)
    //個数限界を超えたら消す
    if(typeof container.children[30] !== 'undefined'){
        container.removeChild(container.children[1]);
    }
}
