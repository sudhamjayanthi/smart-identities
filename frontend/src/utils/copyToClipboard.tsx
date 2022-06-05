const copyToClipboard = (value: string) => {
    const element = document.createElement("textarea")
    element.value = value
    element.setAttribute("readonly", "")
    element.style.position = "absolute"
    element.style.left = "-9999px"
    document.body.appendChild(element)
    element.select()
    document.execCommand("copy")
    document.body.removeChild(element)
    alert("copied")
}

export default copyToClipboard