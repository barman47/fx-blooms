const formatId = (id, prefix='LID', idLen=7) => {
  const PREFIX = prefix;
  let lid = ''
  if (id && id.length > 25) {
    lid = PREFIX + id.substring(1, idLen).toUpperCase()
  } else {
    lid = id
  }
  return lid
}

export default formatId