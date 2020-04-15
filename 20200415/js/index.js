let pbl = (function () {
    let columns = Array.from(document.querySelectorAll('.box')),
        data = []
    console.log(columns);

    let getdata = function getdata() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', 'json/data.json', false)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = JSON.parse(xhr.responseText)
            }
        }
        xhr.send(null)
        console.log(data);
    }

    let bindHTML = function bindHTML() {
		data = data.map(item => {
			let w = item.width,
				h = item.height;
			h = h / (w / 230);
			item.width = 230;
			item.height = h;
			return item;
		});
		for (let i = 0; i < data.length; i += 3) {
			let group = data.slice(i, i + 3);
			group.sort((a, b) => {
				return a.height - b.height;
			});
			columns.sort((a, b) => {
				return b.offsetHeight - a.offsetHeight;
			});
			group.forEach((item, index) => {
				let {
					link,
					pic,
					height,
					title
				} = item;
				let card = document.createElement('div');
				card.className = "card";
				card.innerHTML = `<a href="${link}">
					<div class="lazyImageBox" style="height:${height}px">
						<img src="" alt="" data-image="${pic}">
					</div>
					<p>${title}</p>
				</a>`;
				columns[index].appendChild(card);
			});
		}
	};

    let lazyFunc = function lazyFunc() {
		let lazyImageBoxs = document.querySelectorAll('.lazyImageBox');
		[].forEach.call(lazyImageBoxs, lazyImageBox => {
			let isLoad = lazyImageBox.getAttribute('isLoad');
			if (isLoad === "true") return;
			let a = utils.offset(lazyImageBox).top +
				lazyImageBox.offsetHeight / 2;
			let b = document.documentElement.clientHeight +
				document.documentElement.scrollTop;
			if (a <= b) {
				lazy(lazyImageBox);
			}
		});
	};

    let lazy = function lazy(lazyImageBox) {
		let img = lazyImageBox.querySelector('img'),
			dataImage = img.getAttribute('data-image'),
			temp = new Image;
            temp.src = dataImage;
            temp.onload = () => {
			img.src = dataImage;
			utils.css(img, 'opacity', 1);
		};
		img.removeAttribute('data-image');
		temp = null;
		lazyImageBox.setAttribute('isLoad', 'true');
    };

    let isRender;
	let load= function load() {
		let HTML = document.documentElement;
		if (HTML.clientHeight + HTML.clientHeight / 2 + HTML.scrollTop >= HTML.scrollHeight) {
			if (isRender) return;
			isRender = true;
			getdata();
			bindHTML();
			lazyFunc();
			isRender = false;
		}
	};

    return {
        init() {
            getdata()
            bindHTML()
            lazyFunc()
            window.onscroll=function(){
                lazyFunc();
                load()
            }
        }
    }
})()
pbl.init()