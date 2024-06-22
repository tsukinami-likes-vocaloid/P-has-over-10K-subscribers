// グローバル変数に元のチャンネルデータを保持するための配列を定義
let originalChannels = [];
let currentChannels = []; // 現在表示中のチャンネルデータを保持する配列
let searchKeyword = ""; // 現在の検索キーワードを保持
let tagSearchKeyword = ""; // タグ検索用のキーワードを保持
let currentSortMethod = 'subscribers-desc'; // 現在のソート方法を保持する変数

// モーダルウィンドウを開く関数
function openModal(channel) {
    const modal = document.getElementById('myModal');
    document.getElementById('modal-icon').src = channel['アイコンの画像URL'];
    document.getElementById('modal-name').textContent = channel['データ名'];
    document.getElementById('modal-explanation').textContent = channel['説明'];
    document.getElementById('modal-subscribers').textContent = `登録者数: ${channel['登録者数'].toLocaleString()}`;
    document.getElementById('modal-url').href = channel['URL'];
    modal.style.display = 'block';
}

// サイト説明モーダルを開く関数
function openAboutModal() {
    const modal = document.getElementById('aboutModal');
    modal.style.display = 'block';
}

// モーダルウィンドウを閉じる関数
function closeModal(modal) {
    modal.style.display = 'none';
}



// タグ情報を格納するオブジェクト
let tagsData = {};

// Tags.json ファイルのパス
const tagsJsonUrl = 'Tags.json';

// タグチェックボックスを動的に生成する関数
function createTagCheckboxes() {
    const accordion = document.getElementById('accordion');

    // タグ情報を Tags.json から取得してチェックボックスを生成
    fetch(tagsJsonUrl)
        .then(response => response.json())
        .then(data => {
            tagsData = data;
            Object.keys(tagsData).forEach(tagCategory => {
                // アコーディオン用のカテゴリタイトル
                const categoryTitle = document.createElement('div');
                categoryTitle.className = 'tag-category-title';
                categoryTitle.textContent = tagCategory;
                categoryTitle.addEventListener('click', () => {
                    categoryTitle.classList.toggle('active');
                    const panel = categoryTitle.nextElementSibling;
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + 'px';
                    }
                });
                accordion.appendChild(categoryTitle);

                // アコーディオン用のパネル
                const panel = document.createElement('div');
                panel.className = 'tag-panel';
                accordion.appendChild(panel);

                // カテゴリに対応するタグチェックボックスを生成
                tagsData[tagCategory].forEach(tag => {
                    const checkboxLabel = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'tag-checkbox';
                    checkbox.value = tag;
                    checkbox.addEventListener('change', applyFilters);

                    checkboxLabel.appendChild(checkbox);
                    checkboxLabel.appendChild(document.createTextNode(` ${tag}`));

                    panel.appendChild(checkboxLabel);
                });
            });
        })
        .catch(error => {
            console.error('Failed to fetch tags data:', error);
        });
}



// データを取得する関数
async function fetchChannelData() {
    const response = await fetch('channels.json');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data.channels;
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

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'channel-tags';

        channel['タグ'].forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.className = 'tag-button';
            tagButton.textContent = `#${tag}`;

            tagButton.onclick = (event) => {
                event.stopPropagation(); // 親のクリックイベントを発火しないようにする
                const checkbox = document.querySelector(`.tag-checkbox[value="${tag}"]`);
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    const event = new Event('change');
                    checkbox.dispatchEvent(event);
                }
                applyFilters(); // フィルタを適用
            };
            tagsContainer.appendChild(tagButton);
        });

        const subscribers = document.createElement('div');
        subscribers.className = 'channel-subscribers';
        subscribers.textContent = `登録者数: ${channel['登録者数'].toLocaleString()}`;

        detailsDiv.appendChild(name);
        detailsDiv.appendChild(subscribers);
        detailsDiv.appendChild(tagsContainer);

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

// タグ検索関数
function searchByTags(channels, tags) {
    if (tags.length === 0) {
        return channels; // 選択されたタグがない場合はすべてのデータを返す
    }
    return channels.filter(channel => {
        return tags.every(tag => channel['タグ'].includes(tag));
    });
}

// ソート関数を実行する関数
function applySorting(channels) {
    if (currentSortMethod === 'subscribers-desc') {
        sortBySubscribersDescending(channels);
    } else if (currentSortMethod === 'alphabetical') {
        sortByJapaneseOrder(channels);
    }
}

// 検索およびフィルタを適用する関数
function applyFilters() {
    searchKeyword = document.getElementById('search-input').value.trim();

    const checkedTags = Array.from(document.querySelectorAll('.tag-checkbox:checked'))
        .map(checkbox => checkbox.value);

    let filteredChannels = originalChannels.slice(); // 元のデータからコピー

    filteredChannels = searchChannels(filteredChannels, searchKeyword); // キーワード検索
    filteredChannels = searchByTags(filteredChannels, checkedTags); // タグ検索
    applySorting(filteredChannels); // ソートを適用
    displayChannels(filteredChannels); // 結果を表示
}

// ページが読み込まれたときに実行
document.addEventListener('DOMContentLoaded', async () => {
    try {
        originalChannels = await fetchChannelData();
        currentChannels = originalChannels.slice(); // 現在表示中のデータを初期化

        sortBySubscribersDescending(currentChannels); // 最初は登録者数の多い順でソート
        displayChannels(currentChannels); // ソート後に表示

        createTagCheckboxes(); // タグチェックボックスを生成

        // タグのチェックボックスの変更イベント
        const tagCheckboxes = document.querySelectorAll('.tag-checkbox');
        tagCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                applyFilters(); // フィルタを再適用
            });
        });

        // ソート選択のプルダウンメニュー
        const sortSelect = document.getElementById('sort-select');
        sortSelect.addEventListener('change', () => {
            currentSortMethod = sortSelect.value;
            applyFilters(); // ソートとフィルタを適用
        });

        // 検索フィールドの入力イベント
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
            searchKeyword = searchInput.value.trim();
            applyFilters(); // フィルタを適用
        });

        // 「このサイトについて」のリンクイベント
        const aboutLink = document.getElementById('about-link');
        aboutLink.addEventListener('click', (event) => {
            event.preventDefault();
            openAboutModal();
        });

    } catch (error) {
        console.error('Fetching channel data failed:', error);
    }

    // モーダルウィンドウを閉じるイベントリスナーを追加
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => btn.onclick = (event) => {
        closeModal(event.target.closest('.modal'));
    });
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    };
});
