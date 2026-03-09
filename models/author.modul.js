const { Schema, model } = require('mongoose')

const authorSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Ism kiritilishi shart'],
			trim: true,
			minlength: [2, 'Ism juda qisqalik qiladi'],
			maxlength: [50, 'Ism juda uzun'],
		},
		lastName: {
			type: String,
			required: [true, 'iltimos familiyangizni  kiriitng'],
			trim: true,
			minlength: [2, 'Familiya qisqa'],
		},
		dateOfBirth: {
			type: Number,
			required: [true, ""],
			min: [1000, "Bunday yil mavjud emas"],
			max: [
				new Date().getFullYear(),
				"yilga  to'g'ri kelmaydi",
			],
		},
		dateOfDeath: {
			type: Number,
			default: null,
			validate: {
				validator: function (value) {
					if (value === null) return true
					return value >= this.dateOfBirth
				},
				message: "o'lgan yil tug'ulgan yildan oldin bo'lmadi",
			},
		},
		country: {
			type: String,
			required: [true, 'Mamlakat nomini  kiriting'],
			trim: true,
		},
		bio: {
			type: String,
			required: [true, "Iltimos biografiyaningizni kiritng"],
			minlength: [10, 'bigrafiya juda qisqa'],
		},
		image: {
			type: String,
			default: 'default-author.png',
		},
	},
	{
		timestamps: true,
	},
)

module.exports = model('Author', authorSchema)
