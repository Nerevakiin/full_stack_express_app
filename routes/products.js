import express from 'express'
import { getProducts, getGenres } from '../controllers/productsControllers.js'

export const productsRouter = express.Router()

productsRouter.get('/', getProducts)
productsRouter.get('/genres', getGenres)
