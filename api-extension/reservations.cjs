// Mounted before json-server-auth's rewrite rules. Keeps reservation data private.
module.exports = function reservationRoutes(db, jwt, secret) {
  const day = value => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Copenhagen', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(date);
  };
  return (req, res, next) => {
    const match = req.path.match(/^\/(?:[640]{3}\/)?reservations(?:\/([^/]+))?\/?$/);
    if (!match) return next();
    let claims;
    try {
      const authorization = req.headers.authorization || '';
      if (!authorization.startsWith('Bearer ')) throw new Error('Missing token');
      claims = jwt.verify(authorization.slice(7), secret);
      if (!claims.sub || !db.get('users').find(u => String(u.id) === String(claims.sub)).value()) throw new Error('Unknown user');
    } catch { return res.status(401).json({ message: 'Please log in again.' }); }
    const id = match[1];
    const all = db.get('reservations').value() || [];
    const owns = booking => String(booking.userId) === String(claims.sub);
    if (req.method === 'GET') {
      if (!id) return res.json(all.filter(owns));
      const booking = all.find(item => String(item.id) === id && owns(item));
      return booking ? res.json(booking) : res.status(404).json({ message: 'Booking not found.' });
    }
    if (req.method === 'DELETE' && id) {
      const booking = all.find(item => String(item.id) === id && owns(item));
      if (!booking) return res.status(404).json({ message: 'Booking not found.' });
      db.get('reservations').remove(item => String(item.id) === id).write();
      return res.json({ success: true });
    }
    if (req.method === 'POST' && !id) {
      const body = req.body || {};
      const table = Number(body.table);
      const guests = Number(body.guests);
      const date = day(body.date);
      const capacity = table % 5 === 0 ? 8 : table % 5 === 3 ? 6 : 4;
      if (!Number.isInteger(table) || table < 1 || table > 15 || !Number.isInteger(guests) || guests < 1 || guests > capacity ||
        typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(body.date) || !date || date < day(new Date()) ||
        typeof body.name !== 'string' || body.name.trim().length < 2 ||
        typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
        typeof body.phone !== 'string' || body.phone.trim().length < 8 || body.phone.length > 30 ||
        (body.comment != null && (typeof body.comment !== 'string' || body.comment.length > 500))) {
        return res.status(400).json({ message: 'Check the reservation details.' });
      }
      // Check all users' bookings, including older records with no owner.
      // The check and in-memory insert are synchronous, so concurrent requests cannot both reserve the same table.
      if (all.some(item => Number(item.table) === table && day(item.date) === date)) {
        return res.status(409).json({ message: 'Table already booked for this evening.' });
      }
      const booking = {
        id: require('node:crypto').randomUUID(), userId: Number(claims.sub) || claims.sub,
        name: body.name.trim(), email: body.email.trim(), phone: body.phone.trim(),
        table: String(table), guests: String(guests), date: new Date(body.date).toISOString(), comment: body.comment || '',
      };
      db.get('reservations').push(booking).write();
      return res.status(201).json(booking);
    }
    return res.status(405).json({ message: 'Method not allowed.' });
  };
};
