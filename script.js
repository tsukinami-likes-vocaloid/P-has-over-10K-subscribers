// チャンネルデータを表示する関数
function displayChannels(channels) {
    const channelList = document.getElementById('channel-list');
    channelList.innerHTML = ''; // 表示前にリセット

    channels.forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.className = 'channel';
        channelDiv.onclick = () => openModal(channel);
        
        const img = document.createElement('img');
        img.src = channel['アイコンの画像URL'];
        img.alt = `${channel['データ名']}のアイコン`;
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'channel-details';
        
        const name = document.createElement('div');
        name.className = 'channel-name';
        name.textContent = channel['データ名'];
        
        const subscribers = document.createElement('div');
        subscribers.className = 'channel-subscribers';
        subscribers.textContent = `登録者数: ${channel['登録者数'].toLocaleString()}`;

        const pName = document.createElement('div');
        pName.className = 'channel-pname';
        if (channel['P名']) {
            pName.textContent = `P名: ${channel['P名']}`;
        }
        
        detailsDiv.appendChild(name);
        detailsDiv.appendChild(subscribers);
        if (channel['P名']) {
            detailsDiv.appendChild(pName);
        }
        
        channelDiv.appendChild(img);
        channelDiv.appendChild(detailsDiv);
        
        channelList.appendChild(channelDiv);
    });
}

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    // ここでチャンネルデータを取得して displayChannels を呼び出すなどの処理が入る

    // モーダルの閉じるボタンにイベントリスナーを追加
    const closeModalButton = document.querySelector('.close');
    closeModalButton.addEventListener('click', closeModal);
});
