import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::index
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:22
* @route '/cms/configuration/access-role'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/access-role',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::index
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:22
* @route '/cms/configuration/access-role'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::index
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:22
* @route '/cms/configuration/access-role'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::index
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:22
* @route '/cms/configuration/access-role'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::index
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:22
* @route '/cms/configuration/access-role'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::index
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:22
* @route '/cms/configuration/access-role'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::index
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:22
* @route '/cms/configuration/access-role'
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
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::show
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:71
* @route '/cms/configuration/access-role/{role}'
*/
export const show = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/access-role/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::show
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:71
* @route '/cms/configuration/access-role/{role}'
*/
show.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return show.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::show
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:71
* @route '/cms/configuration/access-role/{role}'
*/
show.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::show
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:71
* @route '/cms/configuration/access-role/{role}'
*/
show.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::show
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:71
* @route '/cms/configuration/access-role/{role}'
*/
const showForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::show
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:71
* @route '/cms/configuration/access-role/{role}'
*/
showForm.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::show
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:71
* @route '/cms/configuration/access-role/{role}'
*/
showForm.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::edit
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:79
* @route '/cms/configuration/access-role/{role}/edit'
*/
export const edit = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/cms/configuration/access-role/{role}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::edit
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:79
* @route '/cms/configuration/access-role/{role}/edit'
*/
edit.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return edit.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::edit
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:79
* @route '/cms/configuration/access-role/{role}/edit'
*/
edit.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::edit
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:79
* @route '/cms/configuration/access-role/{role}/edit'
*/
edit.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::edit
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:79
* @route '/cms/configuration/access-role/{role}/edit'
*/
const editForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::edit
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:79
* @route '/cms/configuration/access-role/{role}/edit'
*/
editForm.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::edit
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:79
* @route '/cms/configuration/access-role/{role}/edit'
*/
editForm.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::update
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:87
* @route '/cms/configuration/access-role/{role}'
*/
export const update = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/cms/configuration/access-role/{role}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::update
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:87
* @route '/cms/configuration/access-role/{role}'
*/
update.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::update
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:87
* @route '/cms/configuration/access-role/{role}'
*/
update.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::update
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:87
* @route '/cms/configuration/access-role/{role}'
*/
update.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::update
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:87
* @route '/cms/configuration/access-role/{role}'
*/
const updateForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::update
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:87
* @route '/cms/configuration/access-role/{role}'
*/
updateForm.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::update
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:87
* @route '/cms/configuration/access-role/{role}'
*/
updateForm.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::destroy
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:100
* @route '/cms/configuration/access-role/{role}'
*/
export const destroy = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cms/configuration/access-role/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::destroy
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:100
* @route '/cms/configuration/access-role/{role}'
*/
destroy.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::destroy
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:100
* @route '/cms/configuration/access-role/{role}'
*/
destroy.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::destroy
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:100
* @route '/cms/configuration/access-role/{role}'
*/
const destroyForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Management\Configuration\AccessRoleController::destroy
* @see app/Http/Controllers/Management/Configuration/AccessRoleController.php:100
* @route '/cms/configuration/access-role/{role}'
*/
destroyForm.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AccessRoleController = { index, show, edit, update, destroy }

export default AccessRoleController