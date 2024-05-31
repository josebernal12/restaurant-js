import categoryModel from "../model/CategoryModel.js"

export const createCategory = async (name, color, idFather, path) => {
    try {
        const category = await categoryModel.create({ name, color, idFather, path })
        if (!category) {
            return {
                msg: 'error al crear una categoria'
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}

export const updateCategory = async (id, name, color, idFather, path) => {
    try {
        const category = await categoryModel.findByIdAndUpdate(id, { name, color, idFather, path }, { new: true })
        if (!category) {
            return {
                msg: 'no hay categoria con ese id'
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}

export const deleteCategory = async (id) => {
    try {
        const category = await categoryModel.findByIdAndDelete(id, { new: true })
        if (!category) {
            return {
                msg: 'no hay categoria con ese id'
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}

export const getAllCategory = async () => {
    try {
        const category = await categoryModel.find()
        if (!category) {
            return {
                category: []
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}

export const getCategoryById = async (id) => {
    try {
        const category = await categoryModel.findById(id)
        if (!category) {
            return {
                msg: 'no hay categoria con ese id'
            }
        }
        return category
    } catch (error) {
        console.log(error)
    }
}









