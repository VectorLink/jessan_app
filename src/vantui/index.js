import Vue from "vue";
import {Button} from "vant";
import { Form } from 'vant';
import { Field } from 'vant';
import { Image as VanImage } from 'vant';
import { Tabbar, TabbarItem } from 'vant';
import { List } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Col, Row } from 'vant';
import { Card } from 'vant';
import {Tag} from "vant";
import { Popup } from 'vant';
import {Toast} from "vant";
import { Search } from 'vant';
import { Picker } from 'vant';
import {RadioGroup} from "vant";
import {Radio} from "vant";
import { Sticky } from 'vant';
import { Calendar } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
import { Uploader } from 'vant';
import { Lazyload } from 'vant';

Vue.use(Lazyload);
Vue.use(Uploader);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Calendar);
Vue.use(Sticky);
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Picker);
Vue.use(Search);
Vue.use(Toast)
Vue.use(Popup);
Vue.use(Card);
Vue.use(Tag)
Vue.use(Col);
Vue.use(Row);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(VanImage)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(List);
Toast.setDefaultOptions({ duration: 4000 });
