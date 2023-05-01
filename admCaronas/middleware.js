export function loginAuth(req, res, next) {
    if (req.session.user !== undefined) {
        next()
    } else {
        res.redirect('/')
    }
}