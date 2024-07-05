
const ETH = () => {
    return(
        <div className="eth-container"style={{ overflow: 'hidden', height: '100px' }}>
            <iframe src="https://www.tradingview-widget.com/embed-widget/single-quote/?locale=en#%7B%22symbol%22%3A%22BITFINEX%3AETHUSD%22%2C%22width%22%3A350%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22height%22%3A126%2C%22utm_source%22%3A%22traderschoice.net%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22single-quote%22%2C%22page-uri%22%3A%22traderschoice.net%2Fabout-traders-choice%2F%3Futm_source%3Dsubstack%26utm_medium%3Demail%22%7D" lang="en"></iframe>
        </div>
    )
}

export default ETH;