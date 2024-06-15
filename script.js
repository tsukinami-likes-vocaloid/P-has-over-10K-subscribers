// データを取得する関数
async function fetchChannelData() {
    const response = await fetch('channels.json');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data.channels;
}

// モーダルウィンドウを開く関数
function openModal(channel) {
    const modal = document.getElementById('myModal');
    document.getElementById('modal-icon').src = channel.icon;
    document.getElementById('modal-name').textContent = channel.name;
    document.getElementById('modal-subscribers').textContent = `登録者数: ${channel.subscribers.toLocaleString()}`;
    document.getElementById('modal-url').href = channel.url;
    
    modal.style.display = 'block';
}

// モーダルウィンドウを閉じる関数
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// チャンネルデータを表示する関数
function displayChannels(channels) {
    const channelList = document.getElementById('channel-list');
    channelList.innerHTML = ''; // 表示前にリセット

    channels.forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.className = 'channel';
        channelDiv.onclick = () => openModal(channel);
        
        const img = document.createElement('img');
        img.src = channel.icon;
        img.alt = `${channel.name}のアイコン`;
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'channel-details';
        
        const name = document.createElement('div');
        name.className = 'channel-name';
        name.textContent = channel.name;
        
        const subscribers = document.createElement('div');
        subscribers.className = 'channel-subscribers';
        subscribers.textContent = `登録者数: ${channel.subscribers.toLocaleString()}`;
        
        detailsDiv.appendChild(name);
        detailsDiv.appendChild(subscribers);
        
        channelDiv.appendChild(img);
        channelDiv.appendChild(detailsDiv);
        
        channelList.appendChild(channelDiv);
    });
}

// ページが読み込まれたときに実行
document.addEventListener('DOMContentLoaded', async () => {
    try {
        let channels = await fetchChannelData();
        displayChannels(channels); // 最初は登録者数の多い順で表示
        
        const sortSelect = document.getElementById('sort-select');
        sortSelect.addEventListener('change', () => {
            const sortMethod = sortSelect.value;
            if (sortMethod === 'subscribers-desc') {
                channels.sort((a, b) => b.subscribers - a.subscribers); // 登録者数の多い順
            } else if (sortMethod === 'alphabetical') {
                channels.sort((a, b) => a.name.localeCompare(b.name)); // あいうえお順
            }
            displayChannels(channels); // データを再表示
        });

    } catch (error) {
        console.error('Fetching channel data failed:', error);
    }

    // モーダルウィンドウを閉じるイベントリスナーを追加
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = closeModal;
    window.onclick = (event) => {
        const modal = document.getElementById('myModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
