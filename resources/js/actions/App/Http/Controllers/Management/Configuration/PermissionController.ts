import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::index
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:24
* @route '/cms/configuration/permissions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::index
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:24
* @route '/cms/configuration/permissions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::index
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:24
* @route '/cms/configuration/permissions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::index
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:24
* @route '/cms/configuration/permissions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::index
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:24
* @route '/cms/configuration/permissions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::index
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:24
* @route '/cms/configuration/permissions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::index
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:24
* @route '/cms/configuration/permissions'
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
* @see \App\Http\Controllers\Management\Configuration\PermissionController::create
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:35
* @route '/cms/configuration/permissions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/permissions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::create
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:35
* @route '/cms/configuration/permissions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::create
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:35
* @route '/cms/configuration/permissions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::create
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:35
* @route '/cms/configuration/permissions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::create
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:35
* @route '/cms/configuration/permissions/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::create
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:35
* @route '/cms/configuration/permissions/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::create
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:35
* @route '/cms/configuration/permissions/create'
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
* @see \App\Http\Controllers\Management\Configuration\PermissionController::store
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:43
* @route '/cms/configuration/permissions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/configuration/permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::store
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:43
* @route '/cms/configuration/permissions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::store
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:43
* @route '/cms/configuration/permissions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::store
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:43
* @route '/cms/configuration/permissions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::store
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:43
* @route '/cms/configuration/permissions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::show
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:53
* @route '/cms/configuration/permissions/{permission}'
*/
export const show = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/permissions/{permission}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::show
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:53
* @route '/cms/configuration/permissions/{permission}'
*/
show.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { permission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            permission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        permission: typeof args.permission === 'object'
        ? args.permission.id
        : args.permission,
    }

    return show.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::show
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:53
* @route '/cms/configuration/permissions/{permission}'
*/
show.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::show
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:53
* @route '/cms/configuration/permissions/{permission}'
*/
show.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::show
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:53
* @route '/cms/configuration/permissions/{permission}'
*/
const showForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::show
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:53
* @route '/cms/configuration/permissions/{permission}'
*/
showForm.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::show
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:53
* @route '/cms/configuration/permissions/{permission}'
*/
showForm.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\PermissionController::edit
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:61
* @route '/cms/configuration/permissions/{permission}/edit'
*/
export const edit = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/permissions/{permission}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::edit
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:61
* @route '/cms/configuration/permissions/{permission}/edit'
*/
edit.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { permission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            permission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        permission: typeof args.permission === 'object'
        ? args.permission.id
        : args.permission,
    }

    return edit.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::edit
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:61
* @route '/cms/configuration/permissions/{permission}/edit'
*/
edit.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::edit
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:61
* @route '/cms/configuration/permissions/{permission}/edit'
*/
edit.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::edit
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:61
* @route '/cms/configuration/permissions/{permission}/edit'
*/
const editForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::edit
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:61
* @route '/cms/configuration/permissions/{permission}/edit'
*/
editForm.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::edit
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:61
* @route '/cms/configuration/permissions/{permission}/edit'
*/
editForm.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\PermissionController::update
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:69
* @route '/cms/configuration/permissions/{permission}'
*/
export const update = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/cms/configuration/permissions/{permission}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::update
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:69
* @route '/cms/configuration/permissions/{permission}'
*/
update.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { permission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            permission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        permission: typeof args.permission === 'object'
        ? args.permission.id
        : args.permission,
    }

    return update.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::update
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:69
* @route '/cms/configuration/permissions/{permission}'
*/
update.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::update
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:69
* @route '/cms/configuration/permissions/{permission}'
*/
update.patch = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::update
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:69
* @route '/cms/configuration/permissions/{permission}'
*/
const updateForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::update
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:69
* @route '/cms/configuration/permissions/{permission}'
*/
updateForm.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::update
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:69
* @route '/cms/configuration/permissions/{permission}'
*/
updateForm.patch = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\PermissionController::destroy
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:79
* @route '/cms/configuration/permissions/{permission}'
*/
export const destroy = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/configuration/permissions/{permission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::destroy
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:79
* @route '/cms/configuration/permissions/{permission}'
*/
destroy.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { permission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            permission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        permission: typeof args.permission === 'object'
        ? args.permission.id
        : args.permission,
    }

    return destroy.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::destroy
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:79
* @route '/cms/configuration/permissions/{permission}'
*/
destroy.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::destroy
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:79
* @route '/cms/configuration/permissions/{permission}'
*/
const destroyForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\PermissionController::destroy
* @see app/Http/Controllers/Management/Configuration/PermissionController.php:79
* @route '/cms/configuration/permissions/{permission}'
*/
destroyForm.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const PermissionController = { index, create, store, show, edit, update, destroy }

export default PermissionController