SELECT s.id, s.title, s.filename, s.file_type, s.genre, s.duration, s.file_size, s.added_date,
       i.filename AS image_file, i.file_type AS image_type,
       p.platform, p.url, p.post_date
FROM songs s
LEFT JOIN images i ON s.id = i.song_id
LEFT JOIN platforms p ON s.id = p.song_id;
