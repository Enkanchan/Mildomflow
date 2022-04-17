
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
    div.style.zIndex = 10;
    div.style.top=clientRect.top + 'px';
    div.style.left=clientRect.left + 'px';
    div.style.height=clientRect.height + 'px';
    div.style.width=clientRect.width + 'px';
    div.style.pointerEvents='none';
    document.body.appendChild(div);
    //ここまで

    //createjs 初期設定
    const canvasObject = div;
    const stage = new createjs.Stage(canvasObject);
    const container = new createjs.Container();
    stage.addChild(container);
    //ここまで 更新処理は呼び出し関数内で行う

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

    const animatetext = new createjs.Text(msg, "bold 1em sans-serif", "White"); //生成テキスト
    const MaxPosX = Math.round(clientRect.width);
    container.addChild(animatetext);
    console.log(clientRect.height);
    console.log(clientRect.width);
    animatetext.x = MaxPosX / 2;
    animatetext.y = Math.round (Math.random()*clientRect.height) / 3;
    //animatetext.outline = 1;
    createjs.Tween.get(animatetext)
            .to({x:-200-animatetext.scaleX},7000);
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        stage.update();
    }
    //console.log(container.children)
    //個数限界を超えたら消す
    if(typeof container.children[30] !== 'undefined'){
        container.removeChild(container.children[1]);
    }
}
