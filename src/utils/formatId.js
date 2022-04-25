const formatId = (id) => {
  const PREFIX = 'LID';
  let lid = ''
  if (id && id.length > 25) {
    lid = PREFIX + id.substring(1, 7).toUpperCase()
  } else {
    lid = id
  }
  return lid
}

export default formatId