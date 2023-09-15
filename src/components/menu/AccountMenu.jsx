import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { green } from '@mui/material/colors';
import { useAuth } from '../../hooks/auth';

export default function AccountMenu({ raffleExist }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { email, nickname, photoURL } = useAuth();
    const userName = nickname ? nickname[0].toUpperCase() : email[0].toUpperCase();
    const open = Boolean(anchorEl);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Tooltip title={nickname ? nickname : email}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    sx={{ padding: 0 }}
                >
                    {photoURL ?
                        <>
                            <Avatar sx={{ width: 40, height: 40 }} src={photoURL}>
                            </Avatar>
                        </>
                        :
                        <>
                            <Avatar sx={{ width: 40, height: 40, bgcolor: green[500] }}>{userName}</Avatar>
                        </>
                    }

                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        bgcolor: '#353535',
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paperw',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Link to="/profile">
                    <MenuItem sx={{ color: 'white' }}>
                        <ListItemIcon>
                            <AccountCircleIcon fontSize="medium" sx={{ color: 'white' }} />
                        </ListItemIcon>
                        Профіль
                    </MenuItem>
                </Link>
                {!raffleExist &&
                    <Link to="/raffle/create">
                        <MenuItem sx={{ color: 'white' }}>
                            <ListItemIcon>
                                <AddCircleIcon fontSize="medium" sx={{ color: 'white' }} />
                            </ListItemIcon>
                            Створити розіграш
                        </MenuItem>
                    </Link>
                }

                {raffleExist &&
                    <Link to="/raffle/edit">
                        <MenuItem sx={{ color: 'white' }}>
                            <ListItemIcon>
                                <EditIcon fontSize="medium" sx={{ color: 'white' }} />
                            </ListItemIcon>
                            Редагувати розіграш
                        </MenuItem>
                    </Link>
                }

                <Link to="/raffle/history">
                    <MenuItem sx={{ color: 'white' }}>
                        <ListItemIcon>
                            <HistoryIcon fontSize="medium" sx={{ color: 'white' }} />
                        </ListItemIcon>
                        Історія розіграшів
                    </MenuItem>
                </Link>
            </Menu>
        </React.Fragment>
    );
};