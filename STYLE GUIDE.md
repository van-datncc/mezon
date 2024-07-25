# Mezon Style Guide

> Purpose of this document is to provide a set of rules and guidelines for writing code in Mezon Framework. Providing a consistent style guide will help developers to read and understand the code more easily and optimize the development process.

This style is a set of rules and examples that will help you to write clean and optimized code.

## Table of Contents

**Should Follow**

1. [One purpose per component](#one-purpose-per-component)
2. [Smart and Dumb Components](#smart-and-dumb-components)
3. [Compute data first](#compute-data-first)
4. [No naked values](#no-naked-values)
5. [No combined hooks](#no-combined-hooks)
6. [No conditional data](#no-conditional-data)
7. [No Inline callbacks](#no-inline-callbacks)

**Nice to Follow**

8. [Component over block](#component-over-block)
9. [CPU over Memory](#cpu-over-memory)
10. [Primitive over Complex props](#primitive-over-complex-props)
11. [useMemo over useEffect](#usememo-over-useeffect)
12. [Component should not know about the parent](#component-should-not-know-about-the-parent)
13. [No unused hooks](#no-unused-hooks)
14. [Fail fast](#fail-fast)

## Should Follow

### One purpose per component

Components should have a single purpose. If you find yourself adding more than one purpose to a component, it's time to split it into multiple components.

#### Bad ❌

```tsx
function User() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const handleClick = () => {
		// handle logout
	};
	return (
		<div>
			<h1>User</h1>
			<p>Welcome {user} to our site!</p>
			<button onClick={handleClick}>Logout</button>
		</div>
	);
}
```

#### Good ✅

```tsx
function User() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const handleClick = () => {
		// handle logout
	};
	return (
		<div>
			<UserDetails user={user} />
			<LogoutButton onClick={handleClick} />
		</div>
	);
}
```

#### Best ⭐

```tsx
function User() {
	return (
		<div>
			<UserDetails />
			<LogoutButton />
		</div>
	);
}

function UserDetails() {
	const user = useSelector(selectUser);
	return <UserDetailsView user={user} />;
}

function LogoutButton() {
	const handleClick = () => {
		// handle logout
	};
	return <Button onClick={handleClick} />;
}
```

### Smart and Dumb Components

A component should be either smart or dumb, but not both. Smart components are responsible for fetching data and managing state, while dumb components are responsible for rendering UI.

#### Bad ❌

```tsx
import React, { useEffect, useState } from 'react';

const UserProfile = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		fetch('/api/user')
			.then((response) => response.json())
			.then((data) => setUser(data));
	}, []);

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
		</div>
	);
};
```

#### Good ✅

```tsx
import React, { useEffect, useState } from 'react';
import UserProfileView from './UserProfileView';

const UserProfileContainer = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		fetch('/api/user')
			.then((response) => response.json())
			.then((data) => setUser(data));
	}, []);

	if (!user) {
		return <div>Loading...</div>;
	}

	return <UserProfileView user={user} />;
};

const UserProfileView = ({ user }) => {
	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
		</div>
	);
};
```

#### Best ⭐

```tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './userSlice';

const UserProfile = () => {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchUser());
	}, [dispatch]);

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<UserProfileView user={user} />
		</div>
	);
};
```

### Compute data first

When rendering a component, compute the data first and then pass it to the component. This will make the component easier to read and test. In most cases, you should compute the data in the store/api and render it in the component.

#### Bad ❌

```tsx
import React from 'react';

const UserProfile = ({ user }) => {
	return (
		<div>
			<h1>
				{user.firstName} {user.lastName}
			</h1>
			<p>{user.age} years old</p>
			<p>{user.city}</p>
		</div>
	);
};

const App = () => {
	const user = { firstName: 'John', lastName: 'Doe', age: 30, city: 'New York' };

	return <UserProfile user={user} />;
};

export default App;
```

#### Good ✅

```tsx
import React from 'react';

const UserProfile = ({ fullName, age, city }) => {
	return (
		<div>
			<h1>{fullName}</h1>
			<p>{age} years old</p>
			<p>{city}</p>
		</div>
	);
};

const App = () => {
	const user = { firstName: 'John', lastName: 'Doe', age: 30, city: 'New York' };
	const fullName = useMemo(() => `${user.firstName} ${user.lastName}`, [user.firstName, user.lastName]);

	return <UserProfile fullName={fullName} age={user.age} city={user.city} />;
};
```

#### Best ⭐

```tsx
import React from 'react';

const UserProfile = ({ fullName, age, city }) => {
	return (
		<div>
			<h1>{fullName}</h1>
			<p>{age} years old</p>
			<p>{city}</p>
		</div>
	);
};

const App = () => {
	const user = useSelector(selectUser);

	return <UserProfile fullName={fullName} age={user.age} city={user.city} />;
};

// user slice
{
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
			state.fullName = `${action.payload.firstName} ${action.payload.lastName}`;
		};
	}
}
```

### No naked values

Avoid using naked values in your components. Instead, use useMemo, useCallback, or useSelector to compute the values.

#### Bad ❌

```tsx
const MyComponent = ({ items }) => {
	return <div>{items.length > 0 ? 'Items available' : 'No items available'}</div>;
};
```

#### Good ✅

```tsx
import { useMemo } from 'react';

const MyComponent = ({ items }) => {
	const hasItems = useMemo(() => items.length > 0, [items]);

	return <div>{hasItems ? 'Items available' : 'No items available'}</div>;
};
```

#### Best ⭐

```tsx
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const selectHasItems = (state) => state.items.length > 0;

const MyComponent = () => {
	const hasItems = useSelector(selectHasItems);

	return <div>{hasItems ? 'Items available' : 'No items available'}</div>;
};
```

### No combined hooks

Avoid combining multiple values in a single hook. Instead, use multiple hooks to compute the values separately to avoid unnecessary re-renders and variable dependencies.

#### Bad ❌

```tsx
function useUserProfile() {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const fullName = `${user.firstName} ${user.lastName}`;

	const editUser = (data) => {
		dispatch(editUser(data));
	};

	return { user, fullName, editUser };
}

function UserProfile() {
	const { user, fullName, editUser } = useUserProfile();

	return (
		<div>
			<h1>{fullName}</h1>
			<button onClick={() => editUser({ firstName: 'Jane' })}>Edit</button>
		</div>
	);
}
```

#### Good ✅

```tsx
function UserProfile() {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();

	const editUser = (data) => {
		dispatch(editUser(data));
	};

	return (
		<div>
			<h1>{user.fullName}</h1>
			<button onClick={() => editUser({ firstName: 'Jane' })}>Edit</button>
		</div>
	);
}
```

#### Best ⭐

```tsx
function useUserEdit() {
	const dispatch = useDispatch();

	const editUser = useCallback(
		(data) => {
			dispatch(editUser(data));
		},
		[dispatch],
	);

	return editUser;
}

function UserProfile() {
	const user = useSelector(selectUser);
	const editUser = useUserEdit();

	return (
		<div>
			<h1>{user.fullName}</h1>
			<button onClick={() => editUser({ firstName: 'Jane' })}>Edit</button>
		</div>
	);
}
```

### No conditional data

Avoid using conditional data in your components. Instead, split the data into separate components and render them conditionally.

#### Bad ❌

```tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const UserProfile: React.FC = () => {
	const user = useSelector(selectUser);
	const shouldShowUser = useSelector(selectShouldShowUser);

	return (
		<div>
			{shouldShowUser && (
				<div>
					<h1>{user.name}</h1>
					<p>{user.email}</p>
				</div>
			)}
		</div>
	);
};
```

#### Good ✅

```tsx
import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile: React.FC = () => {
	const shouldShowUser = useSelector(selectShouldShowUser);

	return <div>{shouldShowUser && <UserDetails />}</div>;
};

function UserDetails() {
	const user = useSelector(selectUser);

	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
		</div>
	);
}
```

#### Best ⭐

```tsx
import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile: React.FC = () => {
	const shouldShowUser = useSelector(selectShouldShowUser);
	const userId = useSelector(selectUserId);

	return <div>{shouldShowUser && <UserDetails userId={userId} />}</div>;
};

function UserDetails({ userId }) {
	const user = useSelector(selectUserById(userId));

	return <UserDetailsView user={user} />;
}
```

#### No Inline callbacks

Avoid using inline callbacks in your components. Instead, define the callback functions outside the component to make the code more readable, maintainable and memorable.

#### Bad ❌

```tsx
import React, { useState } from 'react';

const UserProfile = () => {
	const [name, setName] = useState('John Doe');

	return (
		<div>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)} // Inline callback
			/>
			<button onClick={() => alert('Profile updated!')}>Update Profile</button> // Inline callback
		</div>
	);
};
```

#### Good ✅

```tsx
import React, { useState } from 'react';

const UserProfile = () => {
	const [name, setName] = useState('John Doe');

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleUpdateProfile = () => {
		alert('Profile updated!');
	};

	return (
		<div>
			<input
				type="text"
				value={name}
				onChange={handleNameChange} // Moved callback function
			/>
			<button onClick={handleUpdateProfile}>Update Profile</button> // Moved callback function
		</div>
	);
};

export default UserProfile;
```

#### Best ⭐

```tsx
import React, { useState } from 'react';

const UserProfile = ({ userId }) => {
	const user = useSelector(selectUserById(userId));
	const dispatch = useDispatch();

	const handleEditUser = useCallback(
		(e) => {
			dispatch(editUser({ id: userId, name: e.target.value }));
		},
		[dispatch, userId],
	);

	return (
		<div>
			<UserProfileForm user={user} onSubmit={handleEditUser} />
		</div>
	);
};

export default UserProfile;
```

## Nice to Follow

### Component over block

Use components instead of blocks to make the code more readable and maintainable. Components are reusable and can be easily tested.

#### CPU over Memory

Optimize for CPU usage over memory usage. It's better to compute the data on the fly than to store it in memory.

In fact, it's better to use useMemo or useCallback to compute the data on the fly or even store it in the store/api to avoid unnecessary re-renders and variable dependencies.

#### Primitive over Complex props

Use primitive props over complex props. Primitive props are easier to read and test. In most cases, you should pass the id of the item then select the item userSelector. `useSelector(selectItemById(itemId))` instead of passing the item object.

#### useMemo over useEffect

Use useMemo over useEffect to compute the data. useMemo is more efficient and easier to read than useEffect.

Notes: `useMemo` = `useEffect` + `useState`
See: https://stackoverflow.com/q/56028913

#### Component should not know about the parent

A component should not know about the parent. Instead, use props to pass the data to the child components.

For example, if a component needs if-else logic to determine the data to render, it should be split into separate components and rendered conditionally.

#### No unused hooks

Avoid using hooks that are not needed. Hooks should be used only when necessary to avoid unnecessary re-renders and variable dependencies.

Again, we should split the logic into separate components and render them conditionally to avoid using unnecessary hooks.

#### Fail fast

Always fail fast. If something goes wrong, throw an error and stop the execution. This will help you to catch the errors early and fix them before they cause more problems.

## Conclusion

This style guide is a set of rules and examples that will help you to write clean and optimized code. By following these rules, you will be able to write code that is easier to read, test, and maintain.

Author: [@minhlucvan](https://giuhub.com/minhlucvan)
