const { Schema, model, Types } = require('mongoose')

const bookSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Iltimos  kitob  nonin kiritng'],
			trim: true,
			minlength: [2, 'kitobning  nmi   juda  qisqa'],
			maxlength: [200, 'Kitob nomi juda uzun'],
		},
		pages: {
			type: Number,
			required: [true, "Sahifalar sonini  kiritng"],
			min: [3, "Sahifalar soni kamida 3 ta bo'lishi  kerak"],
		},
		year: {
			type: Number,
			required: [true, "Nashr yili kiritilishi shart"],
			max: [new Date().getFullYear(), "Kelajakdagi yilni kiritish mumkin emas"],
		},
		price: {
			type: Number,
			required: [true, "Kitob narxi kiritilishi shart"],
			min: [0, "Narx manfiy bo'lishi mumkin emas"],
		},
		country: {
			type: String,
			required: [true, "Iltimos  davlatni kiritng"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Iltimos  kitobni tasnifini  kiriting"],
			minlength: [10, "Tasnif  juda qisqa"],
		},
		author: {
			type: Types.ObjectId,
			ref: 'Author',
			required: [true, "Iltimos  muallif  ID-sini  kiriting"],
		},
	},
	{
		timestamps: true,
	},
)
module.exports = model('Book', bookSchema)
