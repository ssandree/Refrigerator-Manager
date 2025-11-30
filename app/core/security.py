# app/core/security.py
import bcrypt


def _to_bytes(password: str | bytes) -> bytes:
    """문자열/바이트 상관없이 bcrypt가 먹을 수 있는 bytes로 변환."""
    if isinstance(password, bytes):
        pw = password
    else:
        pw = str(password).encode("utf-8")
    # bcrypt는 72바이트까지만 사용 → 그 이상이면 잘라서 사용
    if len(pw) > 72:
        pw = pw[:72]
    return pw


def hash_password(plain_password: str) -> str:
    """
    평문 비밀번호를 bcrypt 해시로 변환.
    DB에는 이 문자열을 그대로 저장하면 됨.
    """
    pw_bytes = _to_bytes(plain_password)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw_bytes, salt)
    # mysql VARCHAR에 넣기 위해 str로 변환
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    평문 비밀번호와 저장된 해시가 일치하는지 확인.
    """
    pw_bytes = _to_bytes(plain_password)
    hashed_bytes = hashed_password.encode("utf-8")

    try:
        return bcrypt.checkpw(pw_bytes, hashed_bytes)
    except ValueError:
        # 해시 형식이 이상하면 그냥 실패 처리
        return False
