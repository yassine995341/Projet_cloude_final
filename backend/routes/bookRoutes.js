router.post('/api/books', authenticateToken, async (req, res) => {
    try {
        // ... existing code ...
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: error.message });
    }
});