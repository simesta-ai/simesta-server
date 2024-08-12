class Converter {
    textToArray(text: string): string[] {
        const textArray : string[] = []
        const textList = text.trim().split(/\r?\n/);
        textList.forEach((topic: string) => {
            const components = topic.trim().split(".")
            const text = components[1].trim()
            textArray.push(text)
        })
        return textArray
    }

    arrayToText(array: string[]): string {
        const arrayText: string = array.join(", ")
        arrayText.slice(-2)

        return arrayText
    }
}

export default Converter