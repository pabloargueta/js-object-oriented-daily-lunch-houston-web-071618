// global datastore
let store = { neighborhoods: [], meals: [], customers: [], deliveries: [] };

const Neighborhood = (() => {
    let neighborhoodId = 0
    return class {
        constructor(name) {
            this.name = name
            this.id = ++neighborhoodId
            store.neighborhoods.push(this)
        }

        deliveries() {
            return store.deliveries.filter(delivery => {
                return delivery.neighborhoodId === this.id
            })
        }

        customers() {
            return store.customers.filter(customer => {
                return customer.neighborhoodId === this.id
            })
        }
        meals() {
            const allMeals = this.customers().map(customer => customer.meals())
            const merged = [].concat.apply([], allMeals)
            return [...new Set(merged)]
        }
    }
})();

const Customer = (() => {
    let customerId = 0
    return class {
        constructor(name, neighborhood) {
            this.id = ++customerId
            this.name = name
            this.neighborhoodId = neighborhood
            store.customers.push(this)
        }

        deliveries() {
            return store.deliveries.filter(delivery => {
                return delivery.customerId === this.id
            })
        }
        meals() {
            return this.deliveries().map(delivery => delivery.meal())
        }
        totalSpent() {
            return this.meals().reduce((total, meal) => {
                return total += meal.price
            }, 0)
        }
    }
})();

const Meal = (() => {
    let mealId = 0
    return class {
        constructor(title, price) {
            this.id = ++mealId
            this.title = title
            this.price = price
            store.meals.push(this)
        }

        deliveries() {
            return store.deliveries.filter(delivery => delivery.mealId === this.id)
        }
        customers() {
            return this.deliveries().map(delivery => delivery.customer())
        }
        static byPrice() {
            return store.meals.sort((a, b) => a.price < b.price)
        }
    }
})();

const Delivery = (() => {
    let deliveryId = 0
    return class {
        constructor(meal, neighborhood, customer) {
            this.id = ++deliveryId
            this.mealId = meal
            this.neighborhoodId = neighborhood
            this.customerId = customer
            store.deliveries.push(this)
        }

        meal() {
            return store.meals.find(meal => meal.id === this.mealId)
        }
        customer() {
            return store.customers.find(customer => customer.id === this.customerId)
        }
        neighborhood() {
            return store.neighborhoods.find(neighborhood => neighborhood.id === this.neighborhoodId)
        }
    }
})();

