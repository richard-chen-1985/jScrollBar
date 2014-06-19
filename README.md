jScrollBar
==========

javascript原生实现自定义滚动条，支持鼠标滚轮，自定义滚动条的样式

使用方法
==========

jScrollBar({<br>
	elem: document.getElementById("div2"),<br>
	inner: document.getElementById("cont2"),<br>
	dir: "h",<br>
	barStyle: {<br>
		height:10,<br>
		bottom:0,<br>
		background:"#ccc"<br>
	},<br>
	sliderStyle: {<br>
		height:8,<br>
		top:1,<br>
		background:"#333",<br>
		borderRadius: 8<br>
	}<br>
});<br>

参数说明
==========

<ul>
<li>elem: 要添加滚动条的元素</li>
<li>inner: 要滚动的元素</li>
<li>dir: 滚动方向[ v|h ]，v:垂直滚动，h：水平滚动，默认为v</li>
<li>step: 每次滚动步长(px)，默认为40</li>
<li>barStyle: {} 滚动条的样式</li>
<li>sliderStyle: {} 滚动滑块的样式</li>
</ul>
