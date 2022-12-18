var mock = {
    badgeList: [
        {
            id: 430,
            cover: 'https://ik.imagekit.io/soladata/tr:w-135,h-135/go5h8usy_Tw9HhUYEC',
            title: '感恩节快乐'
        },
        {
            id: 443,
            cover: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/w7r1n4di_QxRt8gZBb',
            title: '魔法师'
        },
        {
            id: 333,
            cover: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/6bzj88py_Z9rQMzf7I',
            title: 'A Presend'
        }
    ]
}

document.addEventListener('DOMSubtreeModified', waitForShow)

var solaCard = null

function waitForShow() {
    getLoginTwitterId()
    findPresend()
    var hoverCard = document.querySelector('#layers div[data-testid="HoverCard"]')
    if (!hoverCard) return
    var positionDom = hoverCard.querySelector('div > div > div.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj')
    if (!positionDom) return

    console.info('[Sola]: Show hover card')
    document.removeEventListener('DOMSubtreeModified', waitForShow)
    document.addEventListener('DOMSubtreeModified', waitForHide)

    var userId = document.querySelector('#layers > div.css-1dbjc4n.r-1p0dtai.r-1d2f490.r-105ug2t.r-u8s1d.r-zchlnj.r-ipm5af > div > div > div > div > div > div > div > div > div.css-1dbjc4n.r-knv0ih > div > div > div > a > div > div > span')
    if (!userId) return
    console.info('User ID', userId.innerHTML)


    // getProfileByTwitterId(userId.innerHTML)

     var sola = new Sola(hoverCard, userId.innerHTML)
    sola.show()
}

function waitForHide() {
    getLoginTwitterId()
    findPresend()
    if (!document.querySelector('#layers div[data-testid="HoverCard"]')) {
        document.removeEventListener('DOMSubtreeModified', waitForHide)
        document.addEventListener('DOMSubtreeModified', waitForShow)

        console.info('[Sola]: Hide hover card')
        if (solaCard) {
            solaCard = solaCard.destroy()
        }
    }
}

function Sola(hoverCard, twitterId) {
    this.dom = null
    this.hoverCard = hoverCard
    this.twitterId = twitterId || ''
    // var that = this
    // getProfileByTwitterId(twitterId, function(err, profile) {
    //     if (err) return
    //     that.initDom(profile.domain)
    // })

    this.initDom = function (solaDomain) {
        this.dom = document.createElement('div')
        this.dom.className = 'loading'
        this.dom.id = 'Sola'
        var loadingImage = chrome.runtime.getURL('/images/loading.svg')
        var solaLogo = chrome.runtime.getURL('/icons/128.png')
        var nameBg = chrome.runtime.getURL('/images/name_bg.png')
        this.dom.innerHTML = `<img class="sola-loading" src="${loadingImage}">
                              <div class="sola-profile">
                                <img src="${solaLogo}">
                                <span class="sola-domain" style="background-image: url('${nameBg}')">${solaDomain}.sociallayer.im</span>
                              </div>
                              <div class="sola-badges">
                                <a target="_blank" href="${config.website}/share/${mock.badgeList[0].id}" title="${mock.badgeList[0].title}">
                                    <img src="${mock.badgeList[0].cover}">
                                </a>
                                <a target="_blank" href="${config.website}/share/${mock.badgeList[1].id}" title="${mock.badgeList[1].title}">
                                    <img src="${mock.badgeList[1].cover}">
                                </a>
                                <a target="_blank" href="${config.website}/share/${mock.badgeList[2].id}" title="${mock.badgeList[2].title}">
                                    <img src="${mock.badgeList[2].cover}">
                                </a>
                              </div>
                              <a target="_blank" class="sola-send-btn" href="${config.website}/badge/mint?to=${'zfd.sociallayer.im'}">Send badge to ${this.twitterId}</a>
                              `
    }

    this.insert = function () {
        var parent = this.hoverCard.querySelector('div.css-1dbjc4n.r-nsbfu8')
        var position = parent.querySelector('.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj')
        this.hoverCard.querySelector('div.css-1dbjc4n.r-nsbfu8').appendChild(this.dom)
    }

    this.show = function () {
        this.initDom()
        this.insert()
    }

    this.showBadge = function (badges) {
        if (!this.dom) return
    }

    this.loaded = function (profile) {
    }

    this.destroy = function () {
        if (!this.dom) return null

        this.dom.remove()
        this.dom = null
        this.hoverCard = null
        return null
    }
}

function getLoginTwitterId() {
    var twitterProfileDom = document.querySelector('div[data-testid=SideNav_AccountSwitcher_Button]')
    if (twitterProfileDom) {
        const id = twitterProfileDom.querySelector('div:nth-child(2) div:nth-child(2) div[tabindex="-1"] span').innerHTML || ''
        if (id) {
            chrome.storage.local.set({'login_twitter_id': id})
                .catch(function (e) {
                    console.error(e)
                })
        }
    }
}

function findPresend() {
    const a = document.querySelectorAll('div[data-testid=tweetText]')
    if (!a.length) return

    for (var i = 0; i < a.length; i++) {
        var dom = a[i]
        if (dom.className.includes('sola-presend')) {
            return
        }

        dom.className = dom.className + ' sola-presend'
        var text = dom.textContent
        if (!text.includes('/presend/')) return
        var content = dom.innerHTML
        var presendLink = content.match(/https:[^\s]*\/presend\/[^d]*_[^d]{7}/i)[0]
        if (!presendLink) return

        var presendInfo = getPresendIdandCode(presendLink)
        var card = document.createElement('div')
        card.setAttribute('class', 'sola-presend-card')
        var logo = chrome.runtime.getURL('/images/logo.png')
        var cheerBg = chrome.runtime.getURL('/images/cheer.png')
        var defaultCover = chrome.runtime.getURL('/icons/128.png')
        chrome.storage.local.get(['user_id','auth_token']).then(function(data) {
            // 登录
            if (data.auth_token) {
                card.innerHTML = `
                    <div class="has-login" style="background-image: url(${cheerBg})">
                        <img class="logo" src="${logo}" alt="">
                        <div class="claim-text">Receive Successfully!</div>
                        <img class="badge-cover" src="https://app.sociallayer.im/images/avatars/avatar_0.png" alt="">
                        <div class="badge-name">loading...</div>
                        <div class="claim-btn loginin">Claim this badge</div>
                        <a class="check-btn" href="${config.website}" target="_blank">Check in your app</a>
                    </div>`
            } else {
                // 未登录
                card.innerHTML = `
                    <div class="has-login">
                        <img class="logo" src="${logo}" alt="">
                        <img class="badge-cover" src="https://app.sociallayer.im/images/avatars/avatar_0.png" alt="">
                        <div class="badge-name">loading...</div>
                        <a class="claim-btn" href="${presendLink}" target="_blank">Login to claim</a>
                    </div>`
            }

            card.style.right = 0 + 'px'
            card.style.top = 0 + 'px'
            dom.appendChild(card)
            var parentDom = getParentNode(dom)
            if (parentDom) {
                parentDom.style.zIndex = '9999'
            }
            getPresendDetail(presendInfo[0], function(presend) {
                card.querySelector('.badge-cover').setAttribute('src', presend.badge.image_url)
                card.querySelector('.badge-name').setAttribute('src', presend.name)
            })

            // bind click event
            var claimBtn = card.querySelector('.claim-btn.loginin')
            if (!claimBtn) return
            claimBtn.addEventListener('click', function(e){
                e.stopPropagation()
                var claimBtn = card.querySelector('.claim-btn.loginin')
                claimBtn.setAttribute('disabled', 'disabled')
                handelClaimPresend(presendInfo[0], presendInfo[1], data.auth_token, function(error){
                    if (!error) {
                        card.querySelector('.has-login').className = 'has-login claimed'
                    }
                    claimBtn.removeAttribute('disabled')
                })
            })
        })
    }
}

function PresendCard(presendLink, tweetTextDom) {
    this.link = presendLink

    const presendArray = presendLink.split('/')
    const info = presendArray[presendArray.length - 1]
    const infoArray = info.split('_')

    this.id = infoArray[0]
    this.code = infoArray[1]

    this.dom = document.createElement('div')
    this.dom.id = 'sola-presend-card'
    var logoUrl = chrome.runtime.getURL('/images/logo.png')

    this.dom.innerHTML = `
        <img src="${logoUrl}">
    `

    this.show = function () {
        tweetTextDom.appendChild(this.dom)
    }

    this.remove = function () {
        this.dom.remove()
    }
}

function getParentNode (child) {
    if (child.parentElement.getAttribute('data-testid') === 'cellInnerDiv') {
        return child.parentElement
    } else {
        return getParentNode(child.parentElement)
    }
}

function getPresendIdandCode (presendLink) {
    var arry = presendLink.split('/')
    var info = arry[arry.length - 1]
    return info.split('_')
}

function getPresendDetail (id, cb) {
    axios.get(`${config.api}/presend/get?id=${id}`).then(function(res) {
        if (res.data.presend) {
            cb(res.data.presend)
        }
        return null
    })
}

function handelClaimPresend (id, code, auth_token, cb) {
    axios.post(`${config.api}/presend/use`, {
        id,
        code,
        auth_token
    }).then(function(res) {
        if (res.data.result === 'error') {
            cb(res.data.message)
        }
        cb(null)
    }).catch(function(err) {
        cb(err)
    })
}

var cache = {}
function getProfileByTwitterId (id, cb) {
    axios.post(`${config.api}/profile/get`, {
        twitter: id,
    }).then(function(res) {
        if (res.data.result === 'error') {
            cb(null, res.data.message)
        }
        cb(res.data.profile)
    }).catch(function(err) {
        cb(err, null)
    })
}



