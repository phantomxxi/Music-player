/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rolate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {

    },
    songs: [{
            name: "On",
            singer: "BTS",
            path: "https://jll.ijjiii.is/46465d936a07d289b3266da05f6da7c1/VnWo9-Dioik/ceivcovnvcem",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Kill This Love",
            singer: "BlackPink",
            path: "https://lss.ijjiii.is/cc4fb8bdb378fdeded7a768c5e9e3833/nO3-QHELKU0/ceivcovnvcem",
            image: "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Lac Troi",
            singer: "Son Tung MTP",
            path: "https://ljs.ijjiii.is/3211db428759171c2d48773cd2fdc659/HZaShvbm8Q0/ceiwcownwcem",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Nu Hong Mong Manh",
            singer: "Bich Phuong",
            path: "https://iis.ijjiii.is/aece85fa96e2b1965e1c96c0aa2fd4bd/mejxhQu5yOc/ceizcoznzcem",
            image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Lanh Leo Remix",
            singer: "SMD",
            path: "https://sls.ijjiii.is/82958a998f27e2864bee506315409c49/Q-XPWGVyEBA/ceixcoxnxcem",
            image: "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Chieu Thu Hoa Bong Nang",
            singer: "Bibo Remix",
            path: "https://jsl.ijjiii.is/1a422c8a15499bb739082928377865ae/XSxxZQbF0Dc/ceiwcownwcem",
            image: "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
            image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {

        // Render playlist
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}"">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.single}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xu ly CD quay / dung
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)',
        }], {
            duration: 10000, // 10seconds
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // Xu ly phong to / thu nho CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || (document.documentElement.scrollTop);
            const newCdWidth = cdWidth - scrollTop;
            // Debug loi keo nhanh qua bi dung thumbnail
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xu ly khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi song duoc play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song bi pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }

        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xu ly khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }

        // Xu ly bat / tat random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xu ly lap lai 1 song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xu ly next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Lang nghe click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //  Xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xu ly khi click vao song option
                if (e.target.closest('.option')) {

                }
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            },
            300)
    },

    // Lay du lieu bai hat hien tai
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        newIndex = Math.floor(Math.random() * this.songs.length);

        // do {
        //     newIndex = Math.floor(Math.random() * this.songs.length);
        // } while (newIndex === this.currentIndex);

        // Danh sach phat ngau nhien khong trung song nao
        if (count > 0) {
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
                var isCheck = arrayTemp.includes(newIndex);
            }
            while (isCheck == true)
        }
        // Test
        //console.log(count,newIndex); 
        //console.log(arrayTemp);

        arrayTemp[count] = newIndex;

        this.currentIndex = newIndex;
        this.loadCurrentSong();
        if (count == this.songs.length - 1) {
            arrayTemp = [];
            count = -1;
        }
        count++;
        // Biến count với biến arrayTemp mình khởi tạo bên trên app
        // var count = 0;
        // var arrayTemp = [];
    },




    start: function() {
        // Gan cau hinh tu config vao ung dung
        this.loadConfig();

        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        // Lang nghe / xu ly cac su kien (DOM events)
        this.handleEvents();

        // Tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hien thi trang thai ban dau cua button repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }

}

app.start();