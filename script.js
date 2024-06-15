// データを取得する関数
async function fetchChannelData() {
    const response = await fetch('channels.json');
    const data = await response.json();
    return data.channels;
}

// チャンネルデータを表示する関数
function displayChannels(channels) {
    const channelList = document.getElementById('channel-list');
    // 登録者数の降順にソート
    channels.sort((a, b) => b.subscribers - a.subscribers);
    
    channels.forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.className = 'channel';
        
        const img = document.createElement('img');
        img.src = channel.icon;
        img.alt = `${channel.name}のアイコン`;
        
        const name = document.createElement('div');
        name.className = 'channel-name';
        name.textContent = channel.name;
        
        const subscribers = document.createElement('div');
        subscribers.textContent = `登録者数: ${channel.subscribers.toLocaleString()}`;
        
        const link = document.createElement('a');
        link.href = channel.url;
        link.target = '_blank';
        link.appendChild(name);
        
        channelDiv.appendChild(img);
        channelDiv.appendChild(link);
        channelDiv.appendChild(subscribers);
        
        channelList.appendChild(channelDiv);
    });
}

// ページが読み込まれたときに実行
document.addEventListener('DOMContentLoaded', async () => {
    const channels = await fetchChannelData();
    displayChannels(channels);
});
