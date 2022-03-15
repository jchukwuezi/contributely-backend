const use = require('@tensorflow-models/universal-sentence-encoder');

(
    async() =>{
        const model = await use.load()
        const embeddings = (
            await model.embed(["Medicine", "Medical"])
        ).unstack()

        const cosine = await tf.losses
        .cosineDistance(embeddings[0], embeddings[1], 0)
        .data()
        console.log("This is the cosine")
        console.log(1 - cosine[0])
    }
)