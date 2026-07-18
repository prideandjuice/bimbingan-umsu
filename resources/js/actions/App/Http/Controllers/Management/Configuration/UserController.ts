import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Management\Configuration\UserController::approve
* @see app/Http/Controllers/Management/Configuration/UserController.php:92
* @route '/cms/configuration/users/{user}/approve'
*/
export const approve = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

approve.definition = {
    methods: ["patch"],
    url: '/cms/configuration/users/{user}/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::approve
* @see app/Http/Controllers/Management/Configuration/UserController.php:92
* @route '/cms/configuration/users/{user}/approve'
*/
approve.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return approve.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::approve
* @see app/Http/Controllers/Management/Configuration/UserController.php:92
* @route '/cms/configuration/users/{user}/approve'
*/
approve.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::approve
* @see app/Http/Controllers/Management/Configuration/UserController.php:92
* @route '/cms/configuration/users/{user}/approve'
*/
const approveForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::approve
* @see app/Http/Controllers/Management/Configuration/UserController.php:92
* @route '/cms/configuration/users/{user}/approve'
*/
approveForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroySessions
* @see app/Http/Controllers/Management/Configuration/UserController.php:103
* @route '/cms/configuration/users/{email}/sessions'
*/
export const destroySessions = (args: { email: string | number } | [email: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySessions.url(args, options),
    method: 'delete',
})

destroySessions.definition = {
    methods: ["delete"],
    url: '/cms/configuration/users/{email}/sessions',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroySessions
* @see app/Http/Controllers/Management/Configuration/UserController.php:103
* @route '/cms/configuration/users/{email}/sessions'
*/
destroySessions.url = (args: { email: string | number } | [email: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { email: args }
    }

    if (Array.isArray(args)) {
        args = {
            email: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        email: args.email,
    }

    return destroySessions.definition.url
            .replace('{email}', parsedArgs.email.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroySessions
* @see app/Http/Controllers/Management/Configuration/UserController.php:103
* @route '/cms/configuration/users/{email}/sessions'
*/
destroySessions.delete = (args: { email: string | number } | [email: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySessions.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroySessions
* @see app/Http/Controllers/Management/Configuration/UserController.php:103
* @route '/cms/configuration/users/{email}/sessions'
*/
const destroySessionsForm = (args: { email: string | number } | [email: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroySessions.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroySessions
* @see app/Http/Controllers/Management/Configuration/UserController.php:103
* @route '/cms/configuration/users/{email}/sessions'
*/
destroySessionsForm.delete = (args: { email: string | number } | [email: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroySessions.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroySessions.form = destroySessionsForm

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::index
* @see app/Http/Controllers/Management/Configuration/UserController.php:23
* @route '/cms/configuration/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::index
* @see app/Http/Controllers/Management/Configuration/UserController.php:23
* @route '/cms/configuration/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::index
* @see app/Http/Controllers/Management/Configuration/UserController.php:23
* @route '/cms/configuration/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::index
* @see app/Http/Controllers/Management/Configuration/UserController.php:23
* @route '/cms/configuration/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::index
* @see app/Http/Controllers/Management/Configuration/UserController.php:23
* @route '/cms/configuration/users'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::index
* @see app/Http/Controllers/Management/Configuration/UserController.php:23
* @route '/cms/configuration/users'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::index
* @see app/Http/Controllers/Management/Configuration/UserController.php:23
* @route '/cms/configuration/users'
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
* @see \App\Http\Controllers\Management\Configuration\UserController::create
* @see app/Http/Controllers/Management/Configuration/UserController.php:35
* @route '/cms/configuration/users/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/users/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::create
* @see app/Http/Controllers/Management/Configuration/UserController.php:35
* @route '/cms/configuration/users/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::create
* @see app/Http/Controllers/Management/Configuration/UserController.php:35
* @route '/cms/configuration/users/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::create
* @see app/Http/Controllers/Management/Configuration/UserController.php:35
* @route '/cms/configuration/users/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::create
* @see app/Http/Controllers/Management/Configuration/UserController.php:35
* @route '/cms/configuration/users/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::create
* @see app/Http/Controllers/Management/Configuration/UserController.php:35
* @route '/cms/configuration/users/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::create
* @see app/Http/Controllers/Management/Configuration/UserController.php:35
* @route '/cms/configuration/users/create'
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
* @see \App\Http\Controllers\Management\Configuration\UserController::store
* @see app/Http/Controllers/Management/Configuration/UserController.php:43
* @route '/cms/configuration/users'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cms/configuration/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::store
* @see app/Http/Controllers/Management/Configuration/UserController.php:43
* @route '/cms/configuration/users'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::store
* @see app/Http/Controllers/Management/Configuration/UserController.php:43
* @route '/cms/configuration/users'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::store
* @see app/Http/Controllers/Management/Configuration/UserController.php:43
* @route '/cms/configuration/users'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::store
* @see app/Http/Controllers/Management/Configuration/UserController.php:43
* @route '/cms/configuration/users'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::show
* @see app/Http/Controllers/Management/Configuration/UserController.php:59
* @route '/cms/configuration/users/{user}'
*/
export const show = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::show
* @see app/Http/Controllers/Management/Configuration/UserController.php:59
* @route '/cms/configuration/users/{user}'
*/
show.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::show
* @see app/Http/Controllers/Management/Configuration/UserController.php:59
* @route '/cms/configuration/users/{user}'
*/
show.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::show
* @see app/Http/Controllers/Management/Configuration/UserController.php:59
* @route '/cms/configuration/users/{user}'
*/
show.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::show
* @see app/Http/Controllers/Management/Configuration/UserController.php:59
* @route '/cms/configuration/users/{user}'
*/
const showForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::show
* @see app/Http/Controllers/Management/Configuration/UserController.php:59
* @route '/cms/configuration/users/{user}'
*/
showForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::show
* @see app/Http/Controllers/Management/Configuration/UserController.php:59
* @route '/cms/configuration/users/{user}'
*/
showForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\UserController::edit
* @see app/Http/Controllers/Management/Configuration/UserController.php:67
* @route '/cms/configuration/users/{user}/edit'
*/
export const edit = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/users/{user}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::edit
* @see app/Http/Controllers/Management/Configuration/UserController.php:67
* @route '/cms/configuration/users/{user}/edit'
*/
edit.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return edit.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::edit
* @see app/Http/Controllers/Management/Configuration/UserController.php:67
* @route '/cms/configuration/users/{user}/edit'
*/
edit.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::edit
* @see app/Http/Controllers/Management/Configuration/UserController.php:67
* @route '/cms/configuration/users/{user}/edit'
*/
edit.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::edit
* @see app/Http/Controllers/Management/Configuration/UserController.php:67
* @route '/cms/configuration/users/{user}/edit'
*/
const editForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::edit
* @see app/Http/Controllers/Management/Configuration/UserController.php:67
* @route '/cms/configuration/users/{user}/edit'
*/
editForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::edit
* @see app/Http/Controllers/Management/Configuration/UserController.php:67
* @route '/cms/configuration/users/{user}/edit'
*/
editForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\UserController::update
* @see app/Http/Controllers/Management/Configuration/UserController.php:75
* @route '/cms/configuration/users/{user}'
*/
export const update = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/cms/configuration/users/{user}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::update
* @see app/Http/Controllers/Management/Configuration/UserController.php:75
* @route '/cms/configuration/users/{user}'
*/
update.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::update
* @see app/Http/Controllers/Management/Configuration/UserController.php:75
* @route '/cms/configuration/users/{user}'
*/
update.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::update
* @see app/Http/Controllers/Management/Configuration/UserController.php:75
* @route '/cms/configuration/users/{user}'
*/
update.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::update
* @see app/Http/Controllers/Management/Configuration/UserController.php:75
* @route '/cms/configuration/users/{user}'
*/
const updateForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::update
* @see app/Http/Controllers/Management/Configuration/UserController.php:75
* @route '/cms/configuration/users/{user}'
*/
updateForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::update
* @see app/Http/Controllers/Management/Configuration/UserController.php:75
* @route '/cms/configuration/users/{user}'
*/
updateForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\UserController::destroy
* @see app/Http/Controllers/Management/Configuration/UserController.php:86
* @route '/cms/configuration/users/{user}'
*/
export const destroy = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/configuration/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroy
* @see app/Http/Controllers/Management/Configuration/UserController.php:86
* @route '/cms/configuration/users/{user}'
*/
destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroy
* @see app/Http/Controllers/Management/Configuration/UserController.php:86
* @route '/cms/configuration/users/{user}'
*/
destroy.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroy
* @see app/Http/Controllers/Management/Configuration/UserController.php:86
* @route '/cms/configuration/users/{user}'
*/
const destroyForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\UserController::destroy
* @see app/Http/Controllers/Management/Configuration/UserController.php:86
* @route '/cms/configuration/users/{user}'
*/
destroyForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const UserController = { approve, destroySessions, index, create, store, show, edit, update, destroy }

export default UserController