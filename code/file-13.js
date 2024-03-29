function run(data) {
    // Database/Factory

    /** @type {LB.DataForScript} */
    const ddd = data

    const columnzz = ddd.db.tables.Column
        .filter((item) => item.entityId === ddd.entity.id && item.inTable && item.name !== "id")

    const itemzz = []
    columnzz.forEach(item => {
        if (item.fakeRaw) {
            if (item.fakeText) {
                itemzz.push(`'${item.name}' => ${item.fakeText}`)
            }
            return
        }

        let text = '$this->faker->'
        if (item.fakeUnique) {
            text += 'unique()->'
        }
        text += item.fakeMethod
        itemzz.push(`'${item.name}' => ${text}(${item.fakeText})`)
    })
    ddd.itemzz = itemzz
}
