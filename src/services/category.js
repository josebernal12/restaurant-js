import categoryModel from "../model/CategoryModel.js"

export const createCategory = async (name, description, color) => {
    try {
        const category = await categoryModel.create({ name, description, color })
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

export const updateCategory = async (id, name, description, color) => {
    try {
        const category = await categoryModel.findByIdAndUpdate(id, { name, description, color }, { new: true })
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









