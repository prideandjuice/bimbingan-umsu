import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::index
* @see app/Http/Controllers/Management/Configuration/MenuController.php:25
* @route '/cms/configuration/menu'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/menu',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::index
* @see app/Http/Controllers/Management/Configuration/MenuController.php:25
* @route '/cms/configuration/menu'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::index
* @see app/Http/Controllers/Management/Configuration/MenuController.php:25
* @route '/cms/configuration/menu'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::index
* @see app/Http/Controllers/Management/Configuration/MenuController.php:25
* @route '/cms/configuration/menu'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::index
* @see app/Http/Controllers/Management/Configuration/MenuController.php:25
* @route '/cms/configuration/menu'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::index
* @see app/Http/Controllers/Management/Configuration/MenuController.php:25
* @route '/cms/configuration/menu'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::index
* @see app/Http/Controllers/Management/Configuration/MenuController.php:25
* @route '/cms/configuration/menu'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::create
* @see app/Http/Controllers/Management/Configuration/MenuController.php:36
* @route '/cms/configuration/menu/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/menu/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::create
* @see app/Http/Controllers/Management/Configuration/MenuController.php:36
* @route '/cms/configuration/menu/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::create
* @see app/Http/Controllers/Management/Configuration/MenuController.php:36
* @route '/cms/configuration/menu/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::create
* @see app/Http/Controllers/Management/Configuration/MenuController.php:36
* @route '/cms/configuration/menu/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::create
* @see app/Http/Controllers/Management/Configuration/MenuController.php:36
* @route '/cms/configuration/menu/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::create
* @see app/Http/Controllers/Management/Configuration/MenuController.php:36
* @route '/cms/configuration/menu/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::create
* @see app/Http/Controllers/Management/Configuration/MenuController.php:36
* @route '/cms/configuration/menu/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::store
* @see app/Http/Controllers/Management/Configuration/MenuController.php:41
* @route '/cms/configuration/menu'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/configuration/menu',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::store
* @see app/Http/Controllers/Management/Configuration/MenuController.php:41
* @route '/cms/configuration/menu'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::store
* @see app/Http/Controllers/Management/Configuration/MenuController.php:41
* @route '/cms/configuration/menu'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::store
* @see app/Http/Controllers/Management/Configuration/MenuController.php:41
* @route '/cms/configuration/menu'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::store
* @see app/Http/Controllers/Management/Configuration/MenuController.php:41
* @route '/cms/configuration/menu'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::show
* @see app/Http/Controllers/Management/Configuration/MenuController.php:51
* @route '/cms/configuration/menu/{menu}'
*/
export const show = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/menu/{menu}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::show
* @see app/Http/Controllers/Management/Configuration/MenuController.php:51
* @route '/cms/configuration/menu/{menu}'
*/
show.url = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { menu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            menu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        menu: typeof args.menu === 'object'
        ? args.menu.id
        : args.menu,
    }

    return show.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::show
* @see app/Http/Controllers/Management/Configuration/MenuController.php:51
* @route '/cms/configuration/menu/{menu}'
*/
show.get = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::show
* @see app/Http/Controllers/Management/Configuration/MenuController.php:51
* @route '/cms/configuration/menu/{menu}'
*/
show.head = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::show
* @see app/Http/Controllers/Management/Configuration/MenuController.php:51
* @route '/cms/configuration/menu/{menu}'
*/
const showForm = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::show
* @see app/Http/Controllers/Management/Configuration/MenuController.php:51
* @route '/cms/configuration/menu/{menu}'
*/
showForm.get = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::show
* @see app/Http/Controllers/Management/Configuration/MenuController.php:51
* @route '/cms/configuration/menu/{menu}'
*/
showForm.head = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::edit
* @see app/Http/Controllers/Management/Configuration/MenuController.php:59
* @route '/cms/configuration/menu/{menu}/edit'
*/
export const edit = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/menu/{menu}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::edit
* @see app/Http/Controllers/Management/Configuration/MenuController.php:59
* @route '/cms/configuration/menu/{menu}/edit'
*/
edit.url = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { menu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            menu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        menu: typeof args.menu === 'object'
        ? args.menu.id
        : args.menu,
    }

    return edit.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::edit
* @see app/Http/Controllers/Management/Configuration/MenuController.php:59
* @route '/cms/configuration/menu/{menu}/edit'
*/
edit.get = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::edit
* @see app/Http/Controllers/Management/Configuration/MenuController.php:59
* @route '/cms/configuration/menu/{menu}/edit'
*/
edit.head = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::edit
* @see app/Http/Controllers/Management/Configuration/MenuController.php:59
* @route '/cms/configuration/menu/{menu}/edit'
*/
const editForm = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::edit
* @see app/Http/Controllers/Management/Configuration/MenuController.php:59
* @route '/cms/configuration/menu/{menu}/edit'
*/
editForm.get = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::edit
* @see app/Http/Controllers/Management/Configuration/MenuController.php:59
* @route '/cms/configuration/menu/{menu}/edit'
*/
editForm.head = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::update
* @see app/Http/Controllers/Management/Configuration/MenuController.php:67
* @route '/cms/configuration/menu/{menu}'
*/
export const update = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/cms/configuration/menu/{menu}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::update
* @see app/Http/Controllers/Management/Configuration/MenuController.php:67
* @route '/cms/configuration/menu/{menu}'
*/
update.url = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { menu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            menu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        menu: typeof args.menu === 'object'
        ? args.menu.id
        : args.menu,
    }

    return update.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::update
* @see app/Http/Controllers/Management/Configuration/MenuController.php:67
* @route '/cms/configuration/menu/{menu}'
*/
update.put = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::update
* @see app/Http/Controllers/Management/Configuration/MenuController.php:67
* @route '/cms/configuration/menu/{menu}'
*/
update.patch = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::update
* @see app/Http/Controllers/Management/Configuration/MenuController.php:67
* @route '/cms/configuration/menu/{menu}'
*/
const updateForm = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::update
* @see app/Http/Controllers/Management/Configuration/MenuController.php:67
* @route '/cms/configuration/menu/{menu}'
*/
updateForm.put = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::update
* @see app/Http/Controllers/Management/Configuration/MenuController.php:67
* @route '/cms/configuration/menu/{menu}'
*/
updateForm.patch = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::destroy
* @see app/Http/Controllers/Management/Configuration/MenuController.php:77
* @route '/cms/configuration/menu/{menu}'
*/
export const destroy = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/configuration/menu/{menu}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::destroy
* @see app/Http/Controllers/Management/Configuration/MenuController.php:77
* @route '/cms/configuration/menu/{menu}'
*/
destroy.url = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { menu: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            menu: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        menu: typeof args.menu === 'object'
        ? args.menu.id
        : args.menu,
    }

    return destroy.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::destroy
* @see app/Http/Controllers/Management/Configuration/MenuController.php:77
* @route '/cms/configuration/menu/{menu}'
*/
destroy.delete = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::destroy
* @see app/Http/Controllers/Management/Configuration/MenuController.php:77
* @route '/cms/configuration/menu/{menu}'
*/
const destroyForm = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\MenuController::destroy
* @see app/Http/Controllers/Management/Configuration/MenuController.php:77
* @route '/cms/configuration/menu/{menu}'
*/
destroyForm.delete = (args: { menu: number | { id: number } } | [menu: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const MenuController = { index, create, store, show, edit, update, destroy }

export default MenuController