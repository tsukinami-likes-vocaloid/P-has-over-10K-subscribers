// グローバル変数に元のチャンネルデータを保持するための配列を定義
let originalChannels = [];
let currentChannels = []; // 現在表示中のチャンネルデータを保持する配列
let searchKeyword = ""; // 現在の検索キーワードを保持

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
    document.getElementById('modal-icon').src = channel['アイコンの画像URL'];
    document.getElementById('modal-name').textContent = channel['データ名'];
    document.getElementById('modal-subscribers').textContent = `登録者数: ${channel['登録者数'].toLocaleString()}`;
    document.getElementById('modal-url').href = channel['URL'];
    
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
        
        detailsDiv.appendChild(name);
        detailsDiv.appendChild(subscribers);
        
        channelDiv.appendChild(img);
        channelDiv.appendChild(detailsDiv);
        
        channelList.appendChild(channelDiv);
    });
}

// ソート関数: 登録者数の多い順
function sortBySubscribersDescending(channels) {
    channels.sort((a, b) => b['登録者数'] - a['登録者数']);
}

// ソート関数: あいうえお順
function sortByJapaneseOrder(channels) {
    channels.sort((a, b) => {
        return a['よみがな'].localeCompare(b['よみがな']);
    });
}

// 検索関数
function searchChannels(channels, keyword) {
    return channels.filter(channel => {
        const searchData = `${channel['データ名']} ${channel['よみがな']}`.toLowerCase();
        return searchData.includes(keyword.toLowerCase());
    });
}

// ページが読み込まれたときに実行
document.addEventListener('DOMContentLoaded', async () => {
    try {
        originalChannels = await fetchChannelData();
        currentChannels = originalChannels.slice(); // 現在表示中のデータを初期化

        sortBySubscribersDescending(currentChannels); // 最初は登録者数の多い順で表示
        displayChannels(currentChannels);

        // ソート選択のプルダウンメニュー
        const sortSelect = document.getElementById('sort-select');
        sortSelect.addEventListener('change', () => {
            const sortMethod = sortSelect.value;
            if (sortMethod === 'subscribers-desc') {
                sortBySubscribersDescending(currentChannels); // 現在表示中のデータをソート
            } else if (sortMethod === 'alphabetical') {
                sortByJapaneseOrder(currentChannels); // 現在表示中のデータをソート
            }
            currentChannels = searchChannels(currentChannels, searchKeyword); // 検索結果を再取得してソート
            displayChannels(currentChannels); // ソート後に再表示
        });

        // 検索フィールドの入力イベント
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
            searchKeyword = searchInput.value.trim();
            if (searchKeyword) {
                currentChannels = searchChannels(originalChannels, searchKeyword); // 元のデータを検索対象とする
            } else {
                currentChannels = originalChannels.slice(); // 元のデータを表示
                sortBySubscribersDescending(currentChannels); // 最初は登録者数の多い順で表示
            }
            currentChannels = searchChannels(currentChannels, searchKeyword); // 検索結果を再取得してソート
            displayChannels(currentChannels);
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
